import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View, Dimensions,Alert} from 'react-native';
import {PROVIDER_GOOGLE} from 'react-native-maps'
import Icon from 'react-native-vector-icons/Ionicons';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {Color} from "./Color";

const RNFS = require('react-native-fs');

const {height, width} = Dimensions.get('window');
export default class Load extends Component<> {

    constructor(props) {
        super(props);
        this.state = {
            path: '',
            fileName: '',
            data: [],
            load: false
        };
    }


    render() {
        const {visible, loadData} = this.props;
        console.log(this.state)
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={visible}
                onRequestClose={() => {
                }}>
                <View
                    style={{
                        position: "absolute",
                        top: 0, left: 0, bottom: 0, right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(2,2,2,0.2)',
                    }}>
                    <View
                        style={{
                            height: width * .6,
                            width: width * .9,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>

                        <View style={{
                            height: width * .6,
                            width: width * .2,
                            backgroundColor: Color.red,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}>
                            <Icon name="ios-attach" size={100} color="#fff" style={{elevation: 5}}/>
                        </View>

                        <View style={{
                            height: width * .45,
                            width: width * .65,
                            backgroundColor: Color.gray
                        }}>

                            <View
                                style={{
                                    width: width * .55,
                                    height: width * .15,
                                    borderRadius: 5,
                                    borderWidth: 0.5,
                                    elevation: 5,
                                    backgroundColor: '#e6e7e8',
                                    alignSelf: 'center',
                                    marginTop: width * .1,
                                }}>
                                <TouchableOpacity
                                    style={{
                                        width: width * .55,
                                        height: width * .15,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        DocumentPicker.show({
                                            filetype: [DocumentPickerUtil.plainText()],
                                        }, (error, res) => {
                                            if (!error) {
                                                console.log(res.uri);
                                                RNFS.readFile(res.uri, 'utf8')
                                                    .then(file => this.setState({
                                                        data: JSON.parse(file),
                                                        path: res.uri,
                                                        fileName: res.fileName
                                                    }))
                                                    .catch(err => Alert.alert('Uyarı', 'Dosya açılamadı.'));
                                            } else console.log(error)
                                        });
                                    }}>
                                    <Text>Dosya seç</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                right: width * .15,
                            }}>
                                <Text>File Name: <Text
                                    style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.fileName}</Text></Text>
                                <Text>Data Length: <Text
                                    style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.data.length}</Text></Text>


                            </View>


                        </View>

                        <View style={{
                            height: width * .15,
                            width: width * .15,
                            position: 'absolute',
                            bottom: 5,
                            right: 0,
                            borderRadius: 5,
                            elevation: 3,
                            backgroundColor: '#f2c777',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                style={{
                                    height: width * .15,
                                    width: width * .15,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => this.state.data.length !== 0 && loadData(this.state.data)}>
                                <Icon name="ios-pin-outline" size={40} color="#fff" style={{elevation: 5}}/>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}
