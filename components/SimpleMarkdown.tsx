import { PropsWithChildren } from 'react';

export default function SimpleMarkdown(props: PropsWithChildren<any>) {
	let body: string = props.children;
	body = body.replace(/\<\!\-\-(.*?)\-\-\>/g, '');
	return <>{body}</>;
}