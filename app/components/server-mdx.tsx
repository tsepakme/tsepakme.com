import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import Image from 'next/image';
import { CopyButton } from './copy-button';
import { highlight } from 'sugar-high';

function CustomLink(props) {
  const href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function Pre({ children }) {
  let code = '';
  let language = '';
  
  if (children?.props?.children && typeof children.props.children === 'string') {
    code = children.props.children;
    language = children.props.className?.replace(/language-/, '') || '';
  }

  return (
    <div className="relative group">
      <pre>
        <CopyButton text={code} />
        {children}
      </pre>
    </div>
  );
}

const components = {
  a: CustomLink,
  Image: RoundedImage,
  img: RoundedImage,
  code: Code,
  pre: Pre,
};

export function ServerMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}