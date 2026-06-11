const items = [
  'Hand Painted Sarees', '·',
  'Luxury Organza', '·',
  'Made to Order', '·',
  'Celebrity Approved', '·',
  'Bridal Couture', '·',
  'Haldi Collection', '·',
];

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
