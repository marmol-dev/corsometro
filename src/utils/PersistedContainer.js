import { AsyncStorage } from 'react-native'
import TasksManager from "./TasksManager";

export function PersistMixin(baseClass) {
    return class PersistedContainer extends baseClass {
        constructor(storageKey) {
            super()
            this.storageKey = storageKey || Object.getPrototypeOf(this).constructor.name
            this.taskManager = new TasksManager()

            this.subscribe(() => {
                this.save()
            })
        }

        async load() {
            const data = await AsyncStorage.getItem(this.storageKey)

            if (!data) {
                return false
            }

            this.setState(JSON.parse(data))
        }

        async save() {
            this.taskManager.executeInBackground(async () => {
                await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.state))
            })
        }
    }
}