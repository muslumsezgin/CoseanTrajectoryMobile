import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {PROVIDER_GOOGLE} from 'react-native-maps'
import Icon from 'react-native-vector-icons/Ionicons';

export default About = ({visible, close}) =>

    <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        onRequestClose={() => close()}>
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
                    height: 250,
                    width: 360,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                <View style={{
                    height: 250,
                    width: 90,
                    backgroundColor: '#BF2A2A',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                }}>
                    <Icon name="ios-person" size={100} color="#fff" style={{elevation: 5}}/>
                </View>

                <View style={{
                    height: 200,
                    width: 250,
                    backgroundColor: '#e6e7e8',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Text style={{fontSize:23, fontWeight:'bold'}}>Cosean Corp.</Text>
                    <Text style={{fontSize:16}}>Müslüm Sezgin</Text>
                    <Text style={{fontSize:16}}>Anıl Coşar</Text>


                </View>

                <View style={{
                    height: 60,
                    width: 60,
                    position: 'absolute',
                    bottom: 5,
                    right: 0,
                    borderRadius: 5,
                    elevation: 3,
                    backgroundColor: '#f2c777',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity style={{
                        height: 60,
                        width: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                                      onPress={() => close()}>
                        <Icon name="ios-close" size={40} color="#fff" style={{elevation: 5}}/>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    </Modal>
