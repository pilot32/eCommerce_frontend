import Container from '../ui/Container';

/** A single stable, verified delivery promise. */
export default function AnnouncementBar() {
  return (
    <div className="bg-maroon text-cream">
      <Container className="flex h-8 items-center justify-center">
        <p className="font-accent text-[11px] font-medium tracking-wide sm:text-xs">
          Free shipping on all orders above ₹1,999
        </p>
      </Container>
    </div>
  );
}
