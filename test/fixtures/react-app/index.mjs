/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import React from 'react';

const e = React.createElement;

export async function getServerSideProps() {
  console.log('fetching additional stuff');
  return { additional: 'stuff' };
}

export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return e(
      'div',
      { },
      this.props.additional,
      ' ',
      e('i', { className: 'its-not-semantic-html-but-i-like-it' }, 'World'),
    );
  }
}
