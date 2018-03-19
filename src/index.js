/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View, ActivityIndicator, Text} from 'react-native';
import MapView, {Marker, Polygon, Polyline, PROVIDER_GOOGLE} from 'react-native-maps'
import Icon from 'react-native-vector-icons/Ionicons';
import Load from "./Load";
import {Color} from "./Color";
import About from "./About";
import {mapStyle} from "./MapStyle";

const imageOrg = require('./image/org.png');
const imageOrgCheck = require('./image/orgCheck.png');
const imageMan = require('./image/man.png');
const imageManCheck = require('./image/manCheck.png');

export default class App extends Component<> {

    state = {
        load: true,
        orgData: [],
        manData: [],
        manRatio: 0.0,
        manDuration: '0 ms',
        queryData: [],
        region: {latitude: 41.015137, longitude: 28.979530, latitudeDelta: 0.1102, longitudeDelta: 0.1035,},
        loading: false,
        error: false,
        selectCoor: [],
        selectPoly: false,
        menu: false,
        type: 'Reduction',
        searchData: 'Original',
        dataPanel: false,
        about: false
    };

    componentWillMount() {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('rgba(0,0,0,0.1)', true)
    }

    onRegionChange = (region) => this.setState({region: {...this.state.region, ...region}});

    getMarkerImage = (v) => {
        const {manData, queryData, orgData} = this.state;
        const query = queryData.length !== 0;
        if (manData.find(f => f.longitude === v.longitude && f.latitude === v.latitude)) {
            if (query && queryData.find(f => f.longitude === v.longitude && f.latitude === v.latitude))
                return imageManCheck;
            else
                return imageMan;
        } else {
            if (query && queryData.find(f => f.longitude === v.longitude && f.latitude === v.latitude))
                return imageOrgCheck;
            else
                return imageOrg;
        }
    };

    reduction = () => {
        this.setState({loading: true});
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        payload.body = JSON.stringify(this.state.orgData);

        // fetch('http://192.168.43.48:9091/api/v1//reduction', payload)
        fetch('http://www.cosean.me/api/trajectory/v1/reduction', payload)
            .then(res => res.json())
            .then(json => this.setState({
                manData: json.reducedData,
                manRatio: json.reductionRatio,
                manDuration: json.reductionDuration,
                loading: false,
                type: 'Search'
            }, () => this.zoom()))
            .catch(err => this.setState({loading: false}))
    };

    search = () => {
        this.setState({loading: true});
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        const coordinates = this.state.searchData === "Original" ? this.state.orgData : this.state.manData;
        const start = this.state.selectCoor[0];
        const end = this.state.selectCoor[1];
        payload.body = JSON.stringify({coordinates, start, end});
        // fetch('http://192.168.43.48:9091/api/v1/query', payload)
        fetch('http://www.cosean.me/api/trajectory/v1/query', payload)
            .then(res => res.json())
            .then(json => this.setState({queryData: json, loading: false}, () => this.zoom()))
            .catch(err => this.setState({loading: false}))

    }

    onMapPress(e) {
        const {selectCoor, selectPoly} = this.state;
        if (selectPoly && selectCoor.length < 2)
            this.setState({selectCoor: [...selectCoor, e.nativeEvent.coordinate], selectPoly: selectCoor.length !== 1})
    }

    createRect = (array) => [
        {"latitude": array[0].latitude, "longitude": array[0].longitude},
        {"latitude": array[0].latitude, "longitude": array[1].longitude},
        {"latitude": array[1].latitude, "longitude": array[1].longitude},
        {"latitude": array[1].latitude, "longitude": array[0].longitude},
    ];

    menuItem = (name, icon, press) => <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingRight: 5}}
        onPress={() => this.setState({menu: false}, () => press())}
    >
        <Text style={{
            color: '#fff',
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginRight: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,.2)',
        }}>
            {name}
        </Text>
        <Icon name={icon} size={35} color="#fff" style={{elevation: 10}}/>
    </TouchableOpacity>

    resetData = () => this.setState({
        load: true,
        orgData: [],
        manData: [],
        manRatio: 0.0,
        manDuration: '0 ms',
        queryData: [],
        region: {latitude: 41.015137, longitude: 28.979530, latitudeDelta: 0.1102, longitudeDelta: 0.1035,},
        loading: false,
        error: false,
        selectCoor: [],
        selectPoly: false,
        menu: false,
        type: 'Reduction',
        searchData: 'Original',
        dataPanel: false,
        about: false
    })

    zoom = () => {
        const reg = this.state.orgData[this.state.orgData.length-1];
        this._map.animateToRegion({...reg, latitudeDelta: 0.0102, longitudeDelta: 0.0035,}, 100);
    }

    render() {
        const {about, load, orgData, manData, region, loading, selectCoor, menu, type, selectPoly, searchData, dataPanel, manDuration, manRatio} = this.state;
        return (
            <View style={{flex: 1}}>
                <Load visible={load} loadData={(data) => this.setState({orgData: data, load: false}, () => this.zoom())}/>
                <About visible={about} close={() => this.setState({about: false})}/>
                <MapView
                    ref={component => this._map = component}
                    customMapStyle={mapStyle}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    onPress={this.onMapPress.bind(this)}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}>

                    <Polyline
                        coordinates={orgData}
                        strokeColor={Color.red}
                        strokeWidth={6}/>

                    <Polyline
                        coordinates={manData}
                        strokeColor={Color.orange}
                        strokeWidth={4}/>

                    {selectCoor.map((v, i) => <Marker.Animated key={i} coordinate={{...v}} pinColor={Color.orange}/>)}
                    {orgData.map((v, i) =>
                        <Marker.Animated key={i} coordinate={{...v}} image={this.getMarkerImage(v)}/>
                    )}
                    {selectCoor.length === 2 &&
                    <Polygon strokeWidth={1} strokeColor={'#eee'} fillColor={'rgba(150,150,150,.5)'}
                             coordinates={this.createRect(selectCoor)}/>}
                </MapView>

                <View style={{position: 'absolute', padding: 15, right: 5, top: 20, alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => this.setState({menu: !menu})}>
                        <Icon name="ios-more-outline" size={55} color="#fff" style={{elevation: 5}}/>
                    </TouchableOpacity>

                    {menu && <View style={{paddingTop: 5, alignItems: 'flex-end'}}>
                        {this.menuItem("Reduction", "ios-color-wand-outline", () => this.setState({type: 'Reduction'}))}
                        {this.menuItem("Search", "ios-funnel-outline", () => this.setState({type: 'Search'}))}
                        {this.menuItem("Reload Data", "ios-cloud-upload-outline", () => this.resetData())}
                        {this.menuItem("About", "ios-information-circle-outline", () => this.setState({about: true}))}
                    </View>}
                </View>

                {!load && <View style={{position: 'absolute', padding: 15, left: 5, top: 20, elevation: 10}}>
                    <Text style={{color: 'white', fontSize: 20, paddingVertical: 10}}>{type}</Text>
                </View>}

                {!load && manData.length === 0 && type === 'Reduction' &&
                <TouchableOpacity style={styles.search} onPress={() => !loading && this.reduction()}>
                    {!loading ? <Icon name="ios-color-wand-outline" size={35} color="#fff" style={{elevation: 5}}/> :
                        <ActivityIndicator animating color={'#fff'} size={'large'}/>}
                </TouchableOpacity>}


                {type === 'Search' && <TouchableOpacity style={{
                    position: 'absolute',
                    right: 42.5,
                    bottom: 105,
                    borderRadius: 50,
                    backgroundColor: selectPoly ? '#6c6' : Color.gray,
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10,
                }} onPress={() => !loading && this.setState({
                    selectPoly: !selectPoly,
                    selectCoor: selectCoor.length === 2 ? [] : selectCoor
                })}>
                    <Icon name="ios-pin-outline" size={25} color={selectPoly ? '#fff' : '#333'} style={{elevation: 5}}/>
                </TouchableOpacity>}

                {type === 'Search' && <TouchableOpacity style={{
                    position: 'absolute',
                    right: 25,
                    bottom: 25,
                    borderRadius: 50,
                    backgroundColor: Color.orange,
                    width: 70,
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10,
                }} onPress={() => !loading && this.search()}>
                    {!loading ? <Icon name="ios-funnel-outline" size={35} color="#fff" style={{elevation: 5}}/> :
                        <ActivityIndicator animating color={'#fff'} size={'large'}/>}
                </TouchableOpacity>}

                <TouchableOpacity style={{
                    position: 'absolute',
                    left: 0,
                    top: 85,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor: Color.gray,
                    width: dataPanel ? 320 : 20,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10,
                    flexDirection: 'row'
                }} onPress={() => this.setState({dataPanel: !dataPanel})}>
                    <View style={{width: dataPanel ? 300 : 0, height: 80, justifyContent: 'center',}}>
                        <Text style={{paddingBottom: 10, paddingHorizontal: 20, fontWeight: 'bold', color: Color.red}}>
                            Reduction Ratio : <Text style={{color: Color.dark, fontSize: 18}}>%{manRatio}</Text>
                        </Text>
                        <Text style={{paddingHorizontal: 20, fontWeight: 'bold', color: Color.red}}>
                            Reduction Duration: <Text style={{color: Color.dark, fontSize: 18}}>{manDuration}</Text>
                        </Text>
                    </View>
                    <Icon name={dataPanel ? "ios-arrow-back" : "ios-arrow-forward"} size={35} color={Color.black}/>
                </TouchableOpacity>


                {type === 'Search' && !selectPoly && <View style={{
                    position: 'absolute',
                    width: '80%',
                    paddingHorizontal: 5,
                    paddingVertical: 15,
                    bottom: 10,
                    elevation: 10,
                }}>
                    {selectCoor.length === 2 ?
                        <TouchableOpacity
                            onPress={() => manData.length !== 0 && this.setState({searchData: searchData === 'Original' ? 'Reduction' : 'Original'})}>
                            <Text style={{color: 'white', fontSize: 20, paddingVertical: 10, textAlign: 'center'}}>
                                The {searchData} data is selected.{"\n"}Click to change
                            </Text>
                        </TouchableOpacity> :
                        <Text style={{color: 'white', fontSize: 20, paddingVertical: 10, textAlign: 'center'}}>
                            Once select 2 point
                        </Text>
                    }
                </View>}

                {type === 'Search' && selectPoly && <View style={{
                    position: 'absolute',
                    width: '80%',
                    paddingHorizontal: 35,
                    paddingVertical: 15,
                    bottom: 10,
                    elevation: 10
                }}>
                    <Text style={{color: 'white', fontSize: 20, paddingVertical: 10, textAlign: 'center'}}>
                        Touch {2 - selectCoor.length} points on the map.
                    </Text>
                </View>}


            </View>

        );
    }
}
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    search: {
        position: 'absolute',
        borderRadius: 50,
        backgroundColor: Color.orange,
        width: 70,
        height: 70,
        right: 25,
        bottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
    },
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
});
