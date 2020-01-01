import { PersistMixin } from '../utils/PersistedContainer';
import uuid from "react-native-uuid";
import moment from "moment";
import 'moment/locale/es'
import { Container } from 'unstated';
moment.locale('es')
import {firestore} from '../firebase'

export const CORSAS_VIEWS_CONTAINER_KEYS = {
    CURRENT: 'corsasViews' + (__DEV__ ? '_dev' : ''),
    HISTORIC: 'corsasViewsHistoric' + (__DEV__ ? '_dev' : '')
}

export class BaseCorsasViewsContainer extends Container {
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

    state = {
        list: []
    }

    add(corsaViews) {
        this.setState(state => ({
            list: [...state.list, ...corsaViews,]
        }))

        const promise = Promise.all(corsaViews.map(cv => firestore.collection('corsasViews').add(cv)))
        return promise
    }

    clear() {
        this.setState({
            list: []
        })
    }

    getFormatedList() {
        const list = this.state.list.map(cv => BaseCorsasViewsContainer.formatCorsaView(cv))
        return list
    }

    getWithLocationList() {
        return this.state.list.filter(cv => cv.location)
    }

    updateById(idCorsaView, partialCorsaView) {
        this.setState(state => ({
            list: state.list.map(cv => {
                if (cv.id !== idCorsaView) {
                    return cv
                }

                return {
                    ...cv,
                    ...partialCorsaView
                }
            })
        }))
    }

    remove(idCorsaView) {
        this.setState(state => ({
            list: state.list.filter(cv => cv.id !== idCorsaView)
        }))
    }

    removeCount(count = 1) {
        if (this.state.list.length < count) {
            throw new Error('List has less elements than remove count: ' + this.state.list.length + ' < ' `count`)
        }
        const removedCvs = this.state.list.slice(0, count)
        const newCvs = this.state.list.slice(count, this.state.list.length)
        this.setState({
            list: newCvs
        })
        return removedCvs
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

export class JoinedCorsasViewsContainer extends BaseCorsasViewsContainer {

    /**
     * 
     * @param {BaseCorsasViewsContainer[]} cvContainers 
     */
    constructor(cvContainers) {
        super()

        const updateList = () => {
            this.setState({
                list: cvContainers.reduce((accum, current) => ([
                    ...accum,
                    ...current.state.list
                ]), [])
            })
        }

        updateList()
        cvContainers.forEach(cvc => cvc.subscribe(updateList))
    }
}

export class CorsasViewsContainer extends PersistMixin(BaseCorsasViewsContainer) {
    static get instance() {
        return this.getInstanceByKey(CORSAS_VIEWS_CONTAINER_KEYS.CURRENT)
    }

    static _instances = new Map()

    /**
     * 
     * @param {string} keyName
     * @returns {CorsasViewsContainer} 
     */
    static getInstanceByKey(keyName) {
        if (!this._instances.has(keyName)) {
            this._instances.set(keyName, new CorsasViewsContainer(keyName))
        }

        return this._instances.get(keyName)
    }

    static getJoinedInstance() {
        if (!this._joinedInstance) {
            this._joinedInstance = new JoinedCorsasViewsContainer([
                CORSAS_VIEWS_CONTAINER_KEYS.HISTORIC,
                CORSAS_VIEWS_CONTAINER_KEYS.CURRENT
            ].map(k => this.getInstanceByKey(k)))
        }

        return this._joinedInstance
    }
}