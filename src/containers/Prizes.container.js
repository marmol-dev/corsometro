import { PersistMixin } from "../utils/PersistedContainer";
import uuid from 'react-native-uuid'
import moment from 'moment'
import { Container } from 'unstated'

export class BasePrizesContainer extends Container {
    state = {
        prizes: []
    }

    static generate(corsasViews) {
        return {
            id: uuid.v4(),
            corsasViews,
            createDate: new Date().toISOString(),
            image: null,
            obtention: {
                done: false,
                date: null,
            }
        }
    }

    add(prizes) {
        this.setState(state => ({
            prizes: [...state.prizes, ...prizes]
        }))
    }

    addOneFromCorsasViews(corsasViews) {
        const prize = BasePrizesContainer.generate(corsasViews)
        this.add([prize])
        return prize
    }

    getFormatedList() {
        return this.state.prizes.map(p => BasePrizesContainer.formatPrize(p))
    }

    static formatPrize(prize) {
        return {
            ...prize,
            formatedCreateDate: moment(prize.createDate).format('D MMMM YYYY')
        };
    }
}

export class PrizesContainer extends PersistMixin(BasePrizesContainer) {
    static get instance() {
        if (!this._instance) {
            this._instance = new PrizesContainer('prizes' + (__DEV__ ? '_dev' : ''))
        }

        return this._instance
    }
}