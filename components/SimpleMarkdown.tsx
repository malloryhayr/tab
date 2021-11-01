import { PropsWithChildren } from 'react';

export default function SimpleMarkdown(props: PropsWithChildren<any>) {
	if(props.children) return props.children
		.replaceAll('<!--', '')
		.replaceAll('-->', '')
	else return <></>;
}