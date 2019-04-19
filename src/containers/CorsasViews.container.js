import { Container } from 'unstated'

export class CorsasViewsContainer extends Container {
    state = {
        list: []
    }

    addOne(corsaView) {
        this.state.list.push(corsaView)
    }
}