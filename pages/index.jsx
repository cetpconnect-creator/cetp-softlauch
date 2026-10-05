import React from 'react';
import YukthiX from './yukthi';

export default function HomePage(props) {
  return <YukthiX {...props} includeHeader={false} includeFooter={false} />;
}
