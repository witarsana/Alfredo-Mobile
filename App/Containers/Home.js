import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image,
  View,
  Text
} from 'react-native'
import { connect } from "react-redux";
import ProductsActions from "../Redux/ProductsRedux";
import CardProduct from '../Components/CardProduct'

import styles from './Styles/HomeStyle'
import HeaderStyle from "../Navigation/Styles/NavigationStyles";
import { apply } from '../Lib/OsmiProvider'

const Home = props => {
  const { products } = props
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    props.getProductsList({ params: '?page=1' })
  }, [])

  const pullRefresh = () => {
    props.getProductsList({ params: '?page=1' })
  }

  const renderItem = ({ item, index }) => (
    <CardProduct
      item={item}
      press={() => alert('Beli')}
    />
  )

  const onEndReached = async (distance) => {
    const { page, lastPage, isLoadMore } = props.products

    if (!isLoadMore && (page < lastPage)) {
      const newPage = page + 1

      props.moreProducts({ params: `?page=${newPage}`, page: newPage })
    }
  }

  return (
    <SafeAreaView style={apply('flex')}>
      {products?.fetching ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={apply('gray-900')} />
        </View>
      ) : (
        <FlatList
          data={products.data}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          contentContainerStyle={apply('p-5 bg-gray-500')}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => pullRefresh()} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() =>
            <View style={styles.emptyState}>
              <Text>Tidak ada data ditampilkan.</Text>
            </View>
          }
          ListFooterComponent={() =>
            products?.isLoadMore && (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={apply("gray-900")} />
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  )
}

const mapStateToProps = (state) => ({
  products: state.products.list
})

const mapDispatctToProps = (dispatch) => ({
  getProductsList: value => dispatch(ProductsActions.getProductsRequest(value)),
  moreProducts: value => dispatch(ProductsActions.moreProductsRequest(value))
})

Home.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state

  return {
    headerStyle: HeaderStyle.default,
    headerTitle: 'Home'
  }
}

export default connect(mapStateToProps, mapDispatctToProps)(Home)
