import React, { Component, Fragment } from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import serviceStyle from './serviceStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import NavigationService from '../../routes/NavigationService';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import SegmentedControlTab from 'react-native-segmented-control-tab'

class ServiceLooking extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            showPrimary: [],
            serviceList: [],
            showPeopleList: [],
            selectedPeople: [],
            selectedUsersID: [],
            categoryList: []
        }
    }


    onSerClick() {
        alert("huih")
    }

    componentWillMount() {
        console.log("========", this.props.data)
        this.subCategoriesApi();
    }

    subCategoriesApi(value) {
        EventRegister.emit('loader', true)

        ApiCaller.call('serviceSubCategories/' + value, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("service===>>>>", response)
                    this.setState({ serviceList: response.sub_service_categories })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    getCategoriesApi() {
        EventRegister.emit('loader', true)

        ApiCaller.call('serviceCategories', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("service_categories===>>>>", response)

                    let temp = []
                    response.service_categories.map((item) => temp.push({ key: item.id, title: item.name }))
                    this.setState({ categoryList: temp })
                    console.log('category list', this.state.categoryList);
                    // this.setState({categoryList : response.service_categories})
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    selectService(id) {
        let serviceList = [...this.state.serviceList];

        var showPeopleList = [];
        var selectedPeople = [];

        for (let data of serviceList) {
            if (data.id == id) {
                data.selected = (data.selected == null) ? true : !data.selected;


                if (data.selected == true) {
                    if (this.state.showPeopleList.includes(data.id) == false) {
                        this.state.selectedPeople.push(data)

                        console.log("show data===>>>", this.state.selectedPeople)

                        this.setState({ selectedPeople: this.state.selectedPeople })

                        this.state.showPeopleList.push(data.id)
                        this.state.selectedUsersID = this.state.showPeopleList.join()
                        console.log("helloo===>>> ", this.state.selectedUsersID)
                    }

                }
                if (data.selected == false) {
                    let sd = this.state.selectedPeople
                    let si = this.state.showPeopleList
                    sd.splice(sd.indexOf(data), 1)
                    si.splice(si.indexOf(data.id), 1)
                    this.setState({
                        selectedPeople: sd,
                        showPeopleList: si,
                        selectedUsersID: si.join(),
                    })

                    console.log('aayaaa', this.state.selectedPeople, this.state.showPeopleList)

                }
                console.log("helloooo", data.selected)
                break;
            }
        }

        this.setState({ serviceList });
    }

    onPressSubmit() {
        console.log("hhhhhhhh", this.state.selectedUsersID)
        // NavigationService.navigate('PaymentScreen', { grandTotal: 35, appointmentID: 117, providerID: 225 })

        if (this.state.selectedUsersID.length == 0) {
            Toasty.show('Please select a service first');
        }
        else {
            NavigationService.navigate("ProvidersScreen")
        }
    }


    render() {
        return (
            <View style={{ flex: 1, marginTop: 10 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>

                        <FlatList
                            scrollEnabled={false}
                            data={this.state.serviceList}
                            contentContainerStyle={{ flex: 1 }}
                            refreshing={this.state.refreshing}
                            renderItem={({ item, index }) =>
                                item.service_category_id == 1 ? <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                    <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center', }} onPress={() => this.selectService(item.id)}>
                                        <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                            {item.image_path ? <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item.image_path }} /> : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                            <Text style={{ flex: 1, paddingLeft: 20, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.name}</Text>
                                            {item.selected == true ? <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/checked.png')} />
                                                : <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/unchecked.png')} />}
                                        </View>
                                    </TouchableOpacity>

                                </View> : null

                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity activeOpacity={1} style={[serviceStyle.buttonStyle]} onPress={() => this.onPressSubmit()}>
                    <Text style={serviceStyle.buttonTextStyle}>Submit</Text>
                </TouchableOpacity>

            </View>
        )
    };

}



class ServiceScreen extends Component {
    constructor() {
        super()
        this.state = {
            serviceList: [],
            index: 0,
            categoryList: [],
            categoryListIds: [],
            categoriess:[],
            email: '',
            showPrimary: [],
            showPeopleList: [],
            selectedPeople: [],
            selectedUsersID: [],
        }
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
                this.setState({ selectedUsersID: [], showPeopleList: [] })
                this.getCategoriesApi();
            }
        );

        // this.serviceApiCall();
    }

    // serviceApiCall() {
    //     ApiCaller.call('serviceCategories', "GET", null, true)
    //         .then((response) => {
    //             if (response) {
    //                 console.log("serviceScreen===>>>>", response)
    //                 this.setState({ serviceList: response.service_categories })
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("ErrorLogin", error);
    //         })
    // }

    getCategoriesApi() {
        EventRegister.emit('loader', true)
        ApiCaller.call('serviceCategories', "GET", null, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("service_categories===>>>>", response)
                    let temp = []
                    response.service_categories.map((item) => temp.push(item.name))
                    this.setState({ categoryList: temp })
                    console.log('category list', this.state.categoryList);
                    let temp2 = []
                    response.service_categories.map((item) => temp2.push(item.id))
                    this.setState({ categoryListIds: temp2, categoriess: response.service_categories })
                    console.log("temp20------------------------",temp2,temp)
                    // this.setState({categoryList : response.service_categories})
                    this.subCategoriesApi(this.state.categoryListIds[this.state.index])
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    subCategoriesApi(value) {
        EventRegister.emit('loader', true)
        ApiCaller.call('serviceCategories/' + value, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("service===>>>>", response)
                    this.setState({ serviceList: response.sub_categories })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    selectService(id) {
        let serviceList = [...this.state.serviceList];

        var showPeopleList = [];
        var selectedPeople = [];

        for (let data of serviceList) {
            if (data.id == id) {
                data.selected = (data.selected == null) ? true : !data.selected;


                if (data.selected == true) {
                    if (this.state.showPeopleList.includes(data.id) == false) {
                        this.state.selectedPeople.push(data)

                        console.log("show data===>>>", this.state.selectedPeople)

                        this.setState({ selectedPeople: this.state.selectedPeople })

                        this.state.showPeopleList.push(data.id)
                        this.state.selectedUsersID = this.state.showPeopleList.join()
                        console.log("helloo===>>> ", this.state.selectedUsersID)
                    }

                }
                if (data.selected == false) {
                    let sd = this.state.selectedPeople
                    let si = this.state.showPeopleList
                    sd.splice(sd.indexOf(data), 1)
                    si.splice(si.indexOf(data.id), 1)
                    this.setState({
                        selectedPeople: sd,
                        showPeopleList: si,
                        selectedUsersID: si.join(),
                    })

                    console.log('aayaaa', this.state.selectedPeople, this.state.showPeopleList)

                }
                console.log("helloooo", data.selected)
                break;
            }
        }

        this.setState({ serviceList });
    }

    onPressSubmit() {
        console.log("hhhhhhhh", this.state.selectedUsersID)
        // NavigationService.navigate('PaymentScreen', { grandTotal: 35, appointmentID: 117, providerID: 225 })

        if (this.state.selectedUsersID.length == 0) {
            Toasty.show('Please select a service first');
        }
        else {
            NavigationService.navigate("ProvidersScreen", { services: this.state.selectedUsersID, servicename: this.state.categoriess[this.state.index].name })
        }
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    onServiceClick() {
        this.props.navigation.navigate('ProvidersScreen')
    }

    componentWillReceiveProps() {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case '0':
                return <ServiceLooking data={'hellooooo'} />
            // case '1':
            //     return <ServiceLooking />;
            // case '2':
            //     return <ServiceLooking />;
            // case '3':
            //     return <ServiceLooking />;
            // case '4':
            //     return <ServiceLooking />;
            default:
                return <ServiceLooking />;
        }
    };

    renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#47CACC' }}
            scrollEnabled={true}
            renderLabel={({ route, focused, color }) => <Text style={{ color: focused == true ? '#000' : '#8d8d8d' }}>{route.title}</Text>}
            style={{ backgroundColor: '#F0EFEF', elevation: 0 }}
            contentContainerStyle={{ width: 'auto' }}
            tabStyle={{ width: 'auto' }}
            indicatorContainerStyle={{ width: 'auto' }}
        />
    );


    handleCustomIndexSelect = (index) => {
        this.setState(prevState => ({ ...prevState, index: index }));
        this.subCategoriesApi(this.state.categoryListIds[index])
    };

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[serviceStyle.statusColor]} />
                <SafeAreaView style={serviceStyle.bottomColor}>
                    <View style={{ flex: 1 }}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Services'
                            title1='' />
                        <View style={{ height: 50 }}>
                            <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={false}>
                                <SegmentedControlTab
                                    // values={['Hair', 'Beard & mustache', 'Face', 'Wax', 'Shave', 'Massage']}
                                    values={this.state.categoryList}
                                    selectedIndex={this.state.index}
                                    onTabPress={this.handleCustomIndexSelect}
                                    borderRadius={0}
                                    tabsContainerStyle={{ height: 50 }}
                                    tabStyle={{
                                        backgroundColor: '#F0EFEF',
                                        borderColor: 'black',
                                        borderBottomColor: 'black',
                                        paddingHorizontal: 10,
                                        borderRightWidth: 0,
                                        borderBottomWidth: 0,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0
                                    }}
                                    activeTabStyle={{
                                        backgroundColor: '#F0EFEF', color: 'black', borderBottomColor: '#47CACC', borderRightWidth: 0,
                                        borderBottomWidth: 3,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0
                                    }}
                                    tabTextStyle={{ color: '#8d8d8d', fontSize: 15, fontFamily: 'Montserrat-SemiBold' }}
                                    activeTabTextStyle={{ color: 'black', fontSize: 16 }}
                                />
                            </ScrollView>
                        </View>
                        {/* {this.state.categoryList.length > 0 ?
                            <TabView
                                navigationState={(this.state.index, [{ key: 0, title: "asdasd" }])}
                                renderScene={(i) => renderScene(i)}
                                renderTabBar={(i) => renderTabBar(i)}
                                onIndexChange={i => this.setState({ index: i })}
                            /> : null} */}

                        <View style={{ flex: 1, marginTop: 10 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1 }}>

                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.serviceList}
                                        contentContainerStyle={{ flex: 1 }}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                                <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center', }} onPress={() => this.selectService(item.id)}>
                                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                                        {/* {item.image_path ? <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item.image_path }} /> : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />} */}
                                                        <Text style={{ flex: 1, paddingLeft: 20, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.name}</Text>
                                                        {item.selected == true ? <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/checked.png')} />
                                                            : <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/unchecked.png')} />}
                                                    </View>
                                                </TouchableOpacity>

                                            </View>

                                        }
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                            </ScrollView>
                            <TouchableOpacity activeOpacity={1} style={[serviceStyle.buttonStyle]} onPress={() => this.onPressSubmit()}>
                                <Text style={serviceStyle.buttonTextStyle}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }


    styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent'
        },

    });
}

export default ServiceScreen;
