/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import builder from 'xmlbuilder';
import { setdefault } from 'ferrum';

export default function emit(context, { secrets, logger }) {
  const cont = setdefault(context, 'content', {});
  const res = setdefault(context, 'response', {});

  if (res.body) {
    logger.debug('Response body already exists');
    return;
  }

  if (!cont.xml) {
    logger.debug('No XML to emit');
    return;
  }

  logger.debug(`Emitting XML from ${typeof cont.xml}`);
  const xml = builder.create(cont.xml, { encoding: 'utf-8' });
  res.body = xml.end({ pretty: !!secrets.XML_PRETTY });
}
