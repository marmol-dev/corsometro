export default class TasksManager {
    executeInBackground(fn) {
        setTimeout(() => {
            fn()
        }, 0)
    }
}