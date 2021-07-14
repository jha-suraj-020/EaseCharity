import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Head from 'next/head';

export default props => {
    return (
        <Container>
            <Head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"></link>
            </Head>
            <Header />
            {props.children}
        </Container>
    );
};