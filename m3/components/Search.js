import { useState, React, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Search = ({ list, setList, filterField = item => item, ...props }) => {

    const [value_data, setValue] = useState("");

    useEffect(() => {
        if (value_data) {
            setList(filterList());
        }
        else {
            setList(list);
        }
    }, [value_data])

    const filterList = () => {
        return list.filter(item => filterField(item).toLowerCase().includes(value_data.toLowerCase()));
    }

    const handleValue = () => {
        setList(filterList());
    };

    return (
        <>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={25} color="black" />
                <TextInput style={styles.search} placeholder='Search Thread Here !' onChangeText={(value) => setValue(value)} onChange={handleValue} value={value_data} {...props}></TextInput>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    search: {
        marginLeft: 10,
        padding: 10,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'tomato',
        //backgroundColor: '#555555'
        borderRadius: 50,
        width: '60%',
    },
    searchSection: {
        //width: '70%',
        //backgroundColor: 'tomato',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        padding: 5,
    },
});

export default Search;