import React, { Component } from 'react';
import {
  Linking,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native-macos';

// 3rd party libraries
import { inject, observer } from 'mobx-react/native';
import { Link } from 'react-router-native';

import TouchBar from '../touch-bar';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
import StockCell from './elements/stock-cell';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  statusBar: {
    height: 22,
  },
  stocksBlock: {
    flexDirection: 'column',
    flex: 11,
  },
  detailedBlock: {
    flex: 5,
    backgroundColor: '#202020',
    justifyContent: 'space-between',
  },
  footerBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#202020',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 15,
    color: 'white',
    textAlign: 'left',
  },
});

@inject('listStore', 'selectedStore') @observer
export default class MainView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      selectedStock: { symbol: 'FB' },
      watchlist: [],
    };
  }

  componentDidMount() {
    this.props.listStore.getWatchlistResult();
    this.prepareRows();
  }

  prepareRows() {
    this.props.listStore.getWatchlistResult();
    this.setState({
      key: Math.random(),
    });
  }

  render() {
    const { dataSource } = this.props.listStore;
    const { selectedStock } = this.props.selectedStore;

    return (
      <View style={styles.container}>
        <TouchBar />
        <View style={styles.statusBar} />
        <View style={styles.stocksBlock}>
          <ListView
            key={this.state.key}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            dataSource={dataSource}
            renderRow={stock => <StockCell stock={stock} />}
            enableEmptySections
          />
        </View>

        <View style={styles.footerBlock}>
          <TouchableHighlight
            style={styles.settings}
            onPress={() => this.prepareRows()}
            underlayColor="#202020"
          >
            <Text style={styles.text}>
              ↺
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.yahoo}
            onPress={() => Linking.openURL(
              `http://finance.yahoo.com/q?s=${selectedStock.symbol}`
            )
            .catch(err => console.error('An error occurred', err))}
            underlayColor="#202020"
          >
            <Text style={styles.text}>
              Yahoo Finance
            </Text>
          </TouchableHighlight>
          <Link to={'settings'} style={styles.settings} underlayColor="#202020">
            <Text style={styles.text}>
              Settings
            </Text>
          </Link>
        </View>
      </View>
    );
  }
}

MainView.propTypes = {
  listStore: React.PropTypes.shape({
    getWatchlistResult: React.PropTypes.func,
    dataSource: React.PropTypes.array,
  }).isRequired,
  selectedStore: React.PropTypes.shape({
    selectedStock: React.PropTypes.object,
  }).isRequired,
};

MainView.defaultProps = {};