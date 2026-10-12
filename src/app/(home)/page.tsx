import LandingPage from '../(localized)/[locale]/page';

export default function RootPage() {
  return <LandingPage params={Promise.resolve({ locale: 'en' })} />;
}
