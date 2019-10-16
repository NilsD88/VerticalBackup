import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';

const uri = 'https://www-uat.proximus.be/smartapps/smartmonitoring/graphql';

export function createApollo(httpLink: HttpLink) {

  const cache = new InMemoryCache({
    addTypename: false
  });
  const client = new ApolloClient({
    cache,
    link: httpLink.create({uri}),
    connectToDevTools: true
  });
  /*
  cache.writeData({
    data: {
      someField: {
        test: 'ok'
      },
    },
  });
  */

  return client;
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
