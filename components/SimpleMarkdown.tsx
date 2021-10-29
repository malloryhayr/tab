import { PropsWithChildren } from 'react';

export default function SimpleMarkdown(props: PropsWithChildren<any>) {
	return props.children
		.replaceAll('<!--', '')
		.replaceAll('-->', '');
}