import { Container } from "unstated";

export class TimerContainer extends Container {
    state = {
        lastDate: new Date()
    }

    constructor(time) {
        super()
        this.refreshInterval = setInterval(() => {
            this.setState({
                lastDate: new Date()
            })
        }, time)
    }

    destroy() {
        clearInterval(this.refreshInterval)
    }
}