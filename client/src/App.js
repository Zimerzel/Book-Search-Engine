import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const http = createHttpLink({
  uri: "/graphql"
})

const auth = setContext((_,{headers}) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token? `Bearer ${token}` : "",
    }
  }
})

const client = new ApolloClient({
  link: auth.concat(http),
  cache: new InMemoryCache(),
  uri: "/graphql"
})


// const client = new ApolloClient({
//   request: (operation) => {
//       const token = localStorage.getItem("id_token");

//       operation.setContext({
//           headers: {
//               authorization: token ? `Bearer ${token}` : "",
//           },
//       });
//   },
//   uri: "/graphql",
// });


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
