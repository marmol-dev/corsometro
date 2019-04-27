import { PersistedContainer } from '../utils/PersistedContainer';
import uuid from "react-native-uuid";
import moment from "moment";
import 'moment/locale/es'
moment.locale('es')

export class CorsasViewsContainer extends PersistedContainer {
    static disclaimers = [
        "He visto un Corsa",
        "Ahí va un Corsa",
        "Corsaaaa 👊",
        "Mira: Corsa!",
        "Eooo, un Corsa!",
        "Toma, Corsa!",
        "Corsa"
    ];

    static getRandomDisclaimer() {
        const index = Math.floor(Math.random() * this.disclaimers.length);
        const disclaimer = this.disclaimers[index];

        return typeof disclaimer === "string" ? disclaimer : disclaimer();
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new CorsasViewsContainer('corsasViews')
        }

        return this._instance
    }

    state = {
        list: []
    }

    add(corsaViews) {
        this.setState(state => ({
            list: [ ...state.list, ...corsaViews,]
        }))
    }

    clear() {
        this.setState({
            list: []
        })
    }

    getFormatedList() {
        const time = this.state.list.map(cv => CorsasViewsContainer.formatCorsaView(cv))
        return time
    }

    remove(idCorsaView) {
        this.setState(state => ({
            list: state.list.filter(cv => cv.id !== idCorsaView)
        }))
    }

    static generate(count = 1) {
        return Array.from({ length: count }, () => ({
            id: uuid.v4(),
            createDate: new Date().toISOString(),
            disclaimer: this.getRandomDisclaimer()
        }))
    }

    static formatCorsaView(corsaView) {
        return {
            ...corsaView,
            dateFromNow: moment(corsaView.createDate).fromNow()
        };
    }
}