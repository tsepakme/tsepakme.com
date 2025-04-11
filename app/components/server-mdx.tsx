// import { MDXRemote } from 'next-mdx-remote/rsc';
// import Link from 'next/link';
// import Image from 'next/image';
// import { mdxComponents } from 'app/components/mdx-components';
// import { highlight } from 'sugar-high';

// function CustomLink(props) {
//   const href = props.href;

//   if (href.startsWith('/')) {
//     return (
//       <Link href={href} {...props}>
//         {props.children}
//       </Link>
//     );
//   }

//   if (href.startsWith('#')) {
//     return <a {...props} />;
//   }

//   return <a target="_blank" rel="noopener noreferrer" {...props} />;
// }

// function RoundedImage(props) {
//   return <Image alt={props.alt} className="rounded-lg" {...props} />;
// }

// function Code({ children, ...props }) {
//   const codeHTML = highlight(children);
//   return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
// }

// const components = {
//   a: CustomLink,
//   Image: RoundedImage,
//   img: RoundedImage,
//   code: Code,
//   pre: mdxComponents.pre,
// };

// export function ServerMDX(props) {
//   return (
//     <MDXRemote
//       {...props}
//       components={{ ...components, ...(props.components || {}) }}
//     />
//   );
// }