import React from 'react';
import YukthiX from '../components/yukthix/index';

export default function HomePage(props) {
  return <YukthiX {...props} includeHeader={false} includeFooter={false} />;
}
