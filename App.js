import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { Container, Content, Header, Body, Title, Picker, Form, Icon, Spinner } from 'native-base';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import { createAppContainer, StackActions, NavigationActions, navigation, navigate } from 'react-navigation';


import styles from './App.style';
// write a GraphQL query that asks details for all countries
const GET_COUNTRIES = gql`
  {
    countries {
      name
      code
      native
      emoji
    }
  }
`;
// write a GraphQL query that asks for each country details
// const GET_COUNTRY_DETAILS = gql`
//   query Country($countryCode: String!) {
//     country(code: $countryCode) {
//       name
//       native
//       emoji
//       currency
//       code
//       phone
//       languages {
//         code
//         name
//       }
//     }
//   }
// `;

// initialize a GraphQL client
const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com',
});
export default class App extends Component {
  state = {
    country: 'US',
    // countryDetails: null,
    countryLoading: true,
    countryName: 'US',
  };

  componentDidMount = () => {
    this.loadData();
  };

  onValueChange(value, key) {
    this.setState({ country: value, countryName: key });
    setTimeout(() => {
      this.loadData();
    }, 0);
  }

  loadData = async () => {
    this.setState({ countryLoading: true });
    const { country } = this.state;
    const { data } = await client.query({
      query: GET_COUNTRY_DETAILS,
      variables: { countryCode: country },
    });
    this.setState({
      countryDetails: data.country,
      countryLoading: false,
    });
  };

  render() {
    const { countryLoading } = this.state;
    return (
      <ApolloProvider client={client}>
        <Container>
          <Header style={{ backgroundColor: 'black' }} androidStatusBarColor="black">
            <Body style={styles.titleBody}>
              <Title>
                <Text style={styles.title} t>
                  Country Directory
                </Text>
              </Title>
            </Body>
          </Header>
          <Content style={styles.mainContainer}>
            <Query query={GET_COUNTRIES} client={client}>
              {({ loading, error, data }) => {
                if (loading) return countryLoading ? null : <Spinner color="green" />;
                if (error) return <Text> {error.message}</Text>;
                return (
                  <View>
                    <View>
                      <Text style={styles.itemTitle}>Choose Country</Text>
                    </View>
                    <Form style={styles.picker}>
                      <Picker
                        mode="dropdown"
                        iosHeader="Select your country"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.country}
                        onValueChange={this.onValueChange.bind(this)}
                      >
                        {data.countries.map(country => (
                          <Picker.Item
                            label={`${country.name} ${country.emoji}`}
                            value={country.code}
                            key={country.name}
                          />
                        ))}
                      </Picker>
                    </Form>
                  </View>
                );
              }}
            </Query>
            <Text>{this.state.country}</Text>
            <Text>{this.state.countryName}</Text>
            <Button
            title="Country Details"
            onPress={() => this.props.navigation.navigate('SecondScreen', {code: this.state.country})}
            />
          </Content>
        </Container>
      </ApolloProvider>
    );
  }
}
