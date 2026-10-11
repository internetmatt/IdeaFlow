/** @jest-environment <rootDir>/../agentflow/src/__test_utils__/jest-environment-jsdom.js */
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import chatflowsApi from '@/api/chatflows'
import DiagramView from './index'
import DiagramAgentView from '../agentcanvas/DiagramAgent'
import { loadDiagramStudio } from './loadDiagramBundle'

jest.mock('@/api/chatflows', () => ({
    getSpecificChatflow: jest.fn(),
    createNewChatflow: jest.fn(),
    updateChatflow: jest.fn()
}))
jest.mock('@/store/constant', () => ({ baseURL: 'http://localhost:3000' }))
jest.mock('./loadDiagramBundle', () => ({
    diagramAssetBase: () => '/diagram/',
    loadDiagramStudio: jest.fn()
}))

const flowData = JSON.stringify({
    schema: 'ideaflow-diagram/v1',
    family: 'agent',
    dsl: '',
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 }
})

function deferred() {
    let resolve
    let reject
    const promise = new Promise((onResolve, onReject) => {
        resolve = onResolve
        reject = onReject
    })
    return { promise, resolve, reject }
}

describe.each([
    { View: DiagramView, path: '/diagram', label: 'Diagram name', type: 'DIAGRAM', defaultName: 'Untitled diagram' },
    { View: DiagramAgentView, path: '/v2/agentcanvas', label: 'Agent name', type: 'AGENTFLOW', defaultName: 'Untitled agent' }
])('$label initialization', ({ View, path, label, type, defaultName }) => {
    let mount

    const record = (id, name = defaultName) => ({ data: { id, name, type, flowData } })
    const open = (id = 'first') =>
        render(
            <MemoryRouter initialEntries={[id ? `${path}/${id}` : path]}>
                <Link to={`${path}/second`}>Second record</Link>
                <Routes>
                    <Route path={path} element={<View />} />
                    <Route path={`${path}/:id`} element={<View />} />
                </Routes>
            </MemoryRouter>
        )

    beforeEach(() => {
        jest.resetAllMocks()
        mount = jest.fn(() => ({ unmount: jest.fn() }))
        loadDiagramStudio.mockResolvedValue({ mount })
        chatflowsApi.updateChatflow.mockResolvedValue({ data: {} })
    })

    it('blocks editing and blur saves until the delayed record load completes', async () => {
        const pending = deferred()
        chatflowsApi.getSpecificChatflow.mockReturnValue(pending.promise)
        open()

        expect(screen.getByLabelText(label)).toBeDisabled()
        fireEvent.blur(screen.getByLabelText(label))
        expect(chatflowsApi.updateChatflow).not.toHaveBeenCalled()
        expect(mount).not.toHaveBeenCalled()

        await act(async () => pending.resolve(record('first')))
        expect(screen.getByLabelText(label)).toBeEnabled()
        fireEvent.change(screen.getByLabelText(label), { target: { value: '' } })
        fireEvent.change(screen.getByLabelText(label), { target: { value: 'Save reload regression' } })
        fireEvent.blur(screen.getByLabelText(label))
        await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument())

        expect(chatflowsApi.updateChatflow).toHaveBeenCalledWith('first', {
            name: 'Save reload regression',
            type,
            flowData
        })
        await act(async () => mount.mock.calls[0][1].onSave(flowData))
        expect(chatflowsApi.updateChatflow).toHaveBeenLastCalledWith('first', {
            name: 'Save reload regression',
            type,
            flowData
        })
    })

    it('waits for initialization after creating and navigating to a new record', async () => {
        const creation = deferred()
        const loading = deferred()
        chatflowsApi.createNewChatflow.mockReturnValue(creation.promise)
        chatflowsApi.getSpecificChatflow.mockReturnValue(loading.promise)
        open(null)

        expect(screen.getByLabelText(label)).toBeDisabled()
        await act(async () => creation.resolve(record('first')))
        expect(chatflowsApi.getSpecificChatflow).toHaveBeenCalledWith('first')
        expect(screen.getByLabelText(label)).toBeDisabled()
        await act(async () => loading.resolve(record('first', 'Persisted name')))
        expect(screen.getByLabelText(label)).toBeEnabled()
        expect(screen.getByLabelText(label)).toHaveValue('Persisted name')
    })

    it('disables a previously loaded name while the next route is loading', async () => {
        const next = deferred()
        chatflowsApi.getSpecificChatflow.mockResolvedValueOnce(record('first', 'First name')).mockReturnValueOnce(next.promise)
        open()
        await waitFor(() => expect(screen.getByLabelText(label)).toHaveValue('First name'))
        fireEvent.click(screen.getByText('Second record'))

        expect(screen.getByLabelText(label)).toBeDisabled()
        fireEvent.blur(screen.getByLabelText(label))
        expect(chatflowsApi.updateChatflow).not.toHaveBeenCalled()
        await act(async () => next.resolve(record('second', 'Second name')))
        expect(screen.getByLabelText(label)).toBeEnabled()
        expect(screen.getByLabelText(label)).toHaveValue('Second name')
    })

    it('ignores an obsolete response after changing routes', async () => {
        const first = deferred()
        const second = deferred()
        chatflowsApi.getSpecificChatflow.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
        open()
        fireEvent.click(screen.getByText('Second record'))
        await act(async () => second.resolve(record('second', 'Second name')))
        await act(async () => first.resolve(record('first', 'Stale name')))

        expect(screen.getByLabelText(label)).toBeEnabled()
        expect(screen.getByLabelText(label)).toHaveValue('Second name')
        await act(async () => {
            fireEvent.blur(screen.getByLabelText(label))
        })
        expect(chatflowsApi.updateChatflow).toHaveBeenCalledWith('second', { name: 'Second name', type, flowData })
    })

    it('keeps editing disabled when loading fails', async () => {
        chatflowsApi.getSpecificChatflow.mockRejectedValue(new Error('Load failed'))
        open()
        await waitFor(() => expect(screen.getByText('Load failed')).toBeInTheDocument())
        expect(screen.getByLabelText(label)).toBeDisabled()
        fireEvent.blur(screen.getByLabelText(label))
        expect(chatflowsApi.updateChatflow).not.toHaveBeenCalled()
        expect(mount).not.toHaveBeenCalled()
    })
})
