import Head from "next/head";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Agenda from "@/components/Agenda";
import Gallery from "@/components/Gallery";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>xÉberson Ávila — Música ao vivo</title>
        <meta
          name="description"
          content="Éberson Ávila, cantor, instrumentista e compositor pernambucano. Shows particulares, corporativos e públicos. Confira a agenda e contrate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Hero />
        <Agenda />
        <Gallery />
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
