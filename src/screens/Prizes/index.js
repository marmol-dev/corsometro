import React from 'react'
import { StyleSheet, FlatList } from 'react-native'

import {
    Container,
    Button,
    Text,
    Header,
    Content,
    Title,
    Body,
    Icon,
    Grid,
    Col,
    Right,
    Footer,
    FooterTab,
    Toast,
    Root,
    View,
    Fab,
    Spinner,
    Row,
    List,
    ListItem,
    Badge,
    Left,
    Subtitle
} from "native-base";
import { CorsasViewsContainer, CORSAS_VIEWS_CONTAINER_KEYS, TimerContainer } from '../../containers';
import { Subscribe } from 'unstated';
import colors from 'native-base/dist/src/theme/variables/commonColor'
import Prompt from 'react-native-prompt-crossplatform';
import { PrizesContainer } from '../../containers/Prizes.container';
import {PrizeItem} from '../../components/PrizeItem'


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // eslint-disable-next-line react-native/no-color-literals
    addPrizeFab: {
        backgroundColor: '#D4AF37'
    }
});

const PROMPT_DEFAULT_TEXT = '50'

export default class PrizesScreen extends React.Component {

    state = {
        isPromptVisible: false,
        promptText: PROMPT_DEFAULT_TEXT,
        promptError: null
    }

    constructor() {
        super()
        this.cvContainer = CorsasViewsContainer
            .getInstanceByKey(CORSAS_VIEWS_CONTAINER_KEYS.CURRENT)
        this.hcvContainer = CorsasViewsContainer
            .getInstanceByKey(CORSAS_VIEWS_CONTAINER_KEYS.HISTORIC)
        this.aggC = CorsasViewsContainer.getJoinedInstance()

        this.prizesContainer = PrizesContainer.instance
        this.timerContainer = new TimerContainer(60 * 1000)

        this.handleAddPrize = this.handleAddPrize.bind(this)
        this.handleChangePromptText = this.handleChangePromptText.bind(this)
        this.handleCancelPrompt = this.handleCancelPrompt.bind(this)
        this.handleSubmitPrompt = this.handleSubmitPrompt.bind(this)
    }

    closePrompt() {
        this.setState({
            promptError: null,
            isPromptVisible: false,
            promptText: PROMPT_DEFAULT_TEXT
        })
    }

    handleAddPrize() {
        this.setState({
            isPromptVisible: true
        })
    }

    handleChangePromptText(promptText) {
        this.setState({
            promptText
        })
    }


    handleCancelPrompt() {
        this.closePrompt()
    }

    handleSubmitPrompt() {
        if (this._errorTimeout) {
            clearTimeout(this._errorTimeout)
        }

        const count = parseInt(this.state.promptText)

        // Error handling
        {
            let promptError = null
            if (isNaN(count) || count < 1) {
                promptError = 'Introduce un número entero, mayor que 0.'
            } else {
                const currentCorsasCount = this.cvContainer.state.list.length
                if (count > currentCorsasCount) {
                    promptError = `Heey, que solo tienes ${currentCorsasCount} corsas 🙄`
                }
            }

            if (promptError) {
                this.setState({
                    promptError
                })
                this._errorTimeout = setTimeout(() => {
                    this.setState({
                        promptError: null
                    })
                }, 2500)
                return
            }
        }

        const removedCorsasViews = this.cvContainer.removeCount(count)
        this.hcvContainer.add(removedCorsasViews)
        this.prizesContainer.addOneFromCorsasViews(removedCorsasViews.map(cv => cv.id))
        this.closePrompt()
    }

    componentWillUnmount() {
        return this.timerContainer.destroy()
    }


    render() {
        const { navigation } = this.props
        return (
            <>
                <Container style={styles.container}>
                    <Subscribe to={[this.cvContainer]}>{
                        cv => (
                            <Header>
                                <Left>
                                    <Button
                                        transparent
                                        onPress={() => navigation.openDrawer()}
                                    >
                                        <Icon name="menu" />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>Premios</Title>
                                    <Subtitle>{cv.state.list.length} corsas</Subtitle>
                                </Body>
                                <Right>
                                </Right>
                            </Header>
                        )
                    }</Subscribe>
                    <Content padder>
                        <Subscribe to={[this.prizesContainer, this.timerContainer]}>
                            {
                                prizesC => (
                                    <FlatList
                                        data={prizesC.getFormatedList()}
                                        keyExtractor={prize => prize.id}
                                        inverted
                                        refreshing
                                        renderItem={prize => (<PrizeItem {...prize.item} onLongPress={() => {}} />)}
                                    />
                                )
                            }
                        </Subscribe>
                    </Content>
                    <Subscribe to={[this.cvContainer]}>{
                        cvc => (
                            cvc.state.list.length > 0 && (
                                <Fab style={styles.addPrizeFab} onPress={this.handleAddPrize}>
                                    <Icon type='Entypo' name="price-ribbon" />
                                </Fab>
                            )
                        )
                    }</Subscribe>
                </Container>
                <Prompt
                    title="Premio de ... corsas"
                    inputPlaceholder="Número de corsas"
                    defaultValue={PROMPT_DEFAULT_TEXT}
                    isVisible={this.state.isPromptVisible}
                    onChangeText={this.handleChangePromptText}
                    onCancel={this.handleCancelPrompt}
                    onSubmit={this.handleSubmitPrompt}
                    errorText={this.state.promptError}
                    primaryColor={colors.brandPrimary}
                    submitButtonText='Prémiame!'
                    cancelButtonText='Cancelar' />
            </>
        )
    }
}