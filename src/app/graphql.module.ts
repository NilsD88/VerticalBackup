import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import {SharedService} from './services/shared.service';

export function createApollo(httpLink: HttpLink, sharedService: SharedService) {

  const uri = sharedService.baseUrl + '/graphql';

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
      deps: [HttpLink, SharedService],
    },
  ],
})
export class GraphQLModule {
}
