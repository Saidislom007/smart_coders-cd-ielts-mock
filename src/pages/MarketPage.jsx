import React from "react";
import "./MarketPage.css";

const MarketPage = () => {
  const plan = {
    title: "CD IELTS Mock",
    price: 100000,
    duration: "1 martalik",
    features: [
      "1 ta to‘liq CD IELTS testi",
      "Audio, Reading, Writing va Speaking bo‘limlari",
      "IELTS standartiga yaqin format",
    ],
  };

  const formatPrice = (price) => price.toLocaleString("uz-UZ");

  return (
    <div className="market-container">
      <h1 className="market-title">🎓 CD IELTS Mock Test</h1>

      <div className="market-card">
        <h2 className="card-title">{plan.title}</h2>
        <p className="card-duration">{plan.duration}</p>

        <p className="card-price">
          {formatPrice(plan.price)} <span>so‘m</span>
        </p>

        <ul className="feature-list">
          {plan.features.map((feature, idx) => (
            <li key={idx}>✅ {feature}</li>
          ))}
        </ul>

        <div className="button-group">
          <a
            href="https://your-click-link.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn click"
          >
            Click orqali to‘lash
          </a>
          <a
            href="https://your-payme-link.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn payme"
          >
            Payme orqali to‘lash
          </a>
        </div>

        <p className="note">
          To‘lovdan so‘ng sizga mock testga kirish imkoniyati taqdim etiladi.
        </p>
      </div>
    </div>
  );
};

export default MarketPage;
