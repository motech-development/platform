import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html className="text-gray-100 leading-tight">
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css?family=Cabin:400,600&display=swap"
            rel="preload"
            as="style"
            onLoad='this.rel="stylesheet"'
          />
        </Head>
        <body className="min-h-screen bg-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
