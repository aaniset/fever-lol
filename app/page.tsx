import Navbar from "@/components/marketing/navbar";
import Benefits from "@/components/marketing/benefits";
import Product from "@/components/marketing/product";
import Faqs from "@/components/marketing/faqs";
import Footer from "@/components/marketing/footer";
import Hero from "@/components/marketing/hero";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <Product />
      <Faqs />
      <Footer />
    </>
  );
}
