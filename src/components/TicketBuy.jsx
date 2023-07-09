import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AppContext } from "./context/GlobalContext";
import "./Css/Sale.css";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import BookmarkRemoveTwoToneIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import CurrencyLiraIcon from "@mui/icons-material/CurrencyLira";
import TagIcon from "@mui/icons-material/Tag";

function TicketBuy() {
  const { eventID } = useParams();
  const [event, setEvent] = useState(null);

  const [expanded, setExpanded] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketType, setTicketType] = useState(null);
  const [price, setPrice] = useState(0);

  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { favoriler, favorilereEkle, favorilerdenCikar } =
    useContext(AppContext);

  const favoriKontrol = (id) => {
    const secim = favoriler.some((u) => u.eventID === id);
    return secim;
  };

  useEffect(() => {
    axios
      .get("https://localhost:7280/api/Event")
      .then((response) => {
        const selectedEvent = response.data.filter(
          (p) => p.eventID === parseInt(eventID)
        );
        setEvent(selectedEvent);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("https://localhost:7280/api/Image")
      .then((res) => {
        const selectedImages = res.data.filter((image) => {
          return image.eventID === parseInt(eventID);
        });
        setImages(selectedImages);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [eventID]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleSeatClick = (seat) => {
    const seatIndex = selectedSeats.indexOf(seat);
    if (seatIndex > -1) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const addTicket = (id) => {
    if (selectedSeats.length === 0 || !ticketType) {
      alert("Lütfen bilet türü ve koltuk seçin.");
      return;
    }
    let newTickets = selectedSeats.map((seat) => ({
      eventID: id,
      ticketType: ticketType,
      seatNumber: seat,
      price: price,
    }));

    axios
      .post("https://localhost:7280/api/Ticket", newTickets)
      .then((res) => {
        console.log(res.data);
        alert("Bilet alındı.");
      })
      .catch((err) => console.log(err));
  };

  const calculateTotalPrice = (id) => {
    const ticketTypePrice = getTicketTypePrice();
    const totalPrice = ticketTypePrice + id;
    setPrice(totalPrice);
  };

  const getTicketTypePrice = () => {
    if (ticketType === "Serbest Oturma Düzeni") {
      return 50;
    } else if (ticketType === "Kategori 1") {
      return 250;
    } else if (ticketType === "Kategori 2") {
      return 200;
    } else if (ticketType === "Kategori 3") {
      return 150;
    } else if (ticketType === "Kategori 4") {
      return 100;
    }
    return 0;
  };

  const toggleRules = () => {
    setExpanded(!expanded);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
  };

  return (
    <>
      <div className="product-list">
        {event &&
          event.map((event) => (
            <div className="wrapper" key={event.eventID}>
              <div className="product-image">
                <div className="slider-container">
                  {images.length > 0 && (
                    <>
                      <button className="prev-button" onClick={prevSlide}>
                        &lt;
                      </button>
                      <img
                        src={images[currentSlide].imageURL}
                        alt="Slider Image"
                        className="slide-image"
                      />
                      <button className="next-button" onClick={nextSlide}>
                        &gt;
                      </button>
                      <div className="row">
                        {images &&
                          images.map((item) => (
                            <div className="img-map">
                              <img
                                src={item.imageURL}
                                alt="Slider Image"
                                className="slide-image"
                              />
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>{" "}
              </div>

              <div className="coldetails">
                <div className="box-header"></div>
                <div className="detays">
                  <div className="hole">
                    <div className="eventselect">
                      <h2> {event.title}</h2>{" "}
                      {favoriKontrol(event.eventID) ? (
                        <div
                          className="select"
                          onClick={() => favorilerdenCikar(event.eventID)}
                        >
                          Takipten çık
                          <BookmarkRemoveTwoToneIcon />
                        </div>
                      ) : (
                        <div
                          className="select"
                          onClick={() => favorilereEkle(event)}
                        >
                          Takibe Al
                          <BookmarkAddRoundedIcon />
                        </div>
                      )}
                    </div>
                    <div className="tags">
                      <NavLink to={`/event/${event.categoryName}`}>
                        <h4 className="label">
                          <TagIcon fontSize="small" />
                          {event.categoryName}
                        </h4>
                      </NavLink>
                      <NavLink to={`/event/${event.venueName}`}>
                        <h4 className="label">
                          <TagIcon fontSize="small" />
                          {event.venueName}
                        </h4>
                      </NavLink>
                      <NavLink to={`/event/${event.genre}`}>
                        <h4 className="label">
                          <TagIcon fontSize="small" />
                          {event.genre}
                        </h4>
                      </NavLink>
                    </div>
                    <div className="altdetails">
                      <h3>Detaylar</h3>
                      <p>{event.description}</p>
                      <p>{event.address}</p>
                      <p>
                        <time dateTime={event.startDate}>
                          {new Date(event.startDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </time>
                      </p>
                      <p>
                        <time dateTime={event.endDate}>
                          {new Date(event.endDate).toLocaleDateString("tr-TR")}
                        </time>
                      </p>

                      <a className="button" href={event.googleMapsLink}>
                        {" "}
                        <LocationOnOutlinedIcon fontSize="medium" />{" "}
                        <p>Konum</p>{" "}
                      </a>

                      <>
                        {/* Sharingbutton Facebook */}
                        <a
                          className="resp-sharing-button__link"
                          href={`https://facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A3000%2Fticket%2F${event.eventID}`}
                          target="_blank"
                          rel="noopener"
                          aria-label="Facebook"
                        >
                          <div className="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--medium">
                            <div
                              aria-hidden="true"
                              className="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm3.6 11.5h-2.1v7h-3v-7h-2v-2h2V8.34c0-1.1.35-2.82 2.65-2.82h2.35v2.3h-1.4c-.25 0-.6.13-.6.66V9.5h2.34l-.24 2z" />
                              </svg>
                            </div>
                            Facebook
                          </div>
                        </a>
                        {/* Sharingbutton Twitter */}
                        <a
                          className="resp-sharing-button__link"
                          href={`https://twitter.com/intent/tweet/?text=Bu%20etkinlik%20ka%C3%A7maz&url=http%3A%2F%2Flocalhost%3A3000%2Fticket%2F${event.eventID}`}
                          target="_blank"
                          rel="noopener"
                          aria-label="Twitter"
                        >
                          <div className="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--medium">
                            <div
                              aria-hidden="true"
                              className="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm5.26 9.38v.34c0 3.48-2.64 7.5-7.48 7.5-1.48 0-2.87-.44-4.03-1.2 1.37.17 2.77-.2 3.9-1.08-1.16-.02-2.13-.78-2.46-1.83.38.1.8.07 1.17-.03-1.2-.24-2.1-1.3-2.1-2.58v-.05c.35.2.75.32 1.18.33-.7-.47-1.17-1.28-1.17-2.2 0-.47.13-.92.36-1.3C7.94 8.85 9.88 9.9 12.06 10c-.04-.2-.06-.4-.06-.6 0-1.46 1.18-2.63 2.63-2.63.76 0 1.44.3 1.92.82.6-.12 1.95-.27 1.95-.27-.35.53-.72 1.66-1.24 2.04z" />
                              </svg>
                            </div>
                            Twitter
                          </div>
                        </a>
                        {/* Sharingbutton WhatsApp */}
                        <a
                          className="resp-sharing-button__link"
                          href={`whatsapp://send?text=Bu%20etkinlik%20ka%C3%A7maz%20http%3A%2F%2Flocalhost%3A3000%2Fticket%2F${event.eventID}`}
                          target="_blank"
                          rel="noopener"
                          aria-label="WhatsApp"
                        >
                          <div className="resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--medium">
                            <div
                              aria-hidden="true"
                              className="resp-sharing-button__icon resp-sharing-button__icon--solidcircle"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height={24}
                                width={24}
                                viewBox="0 0 24 24"
                              >
                                <path d="m12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 3.8c2.2 0 4.2 0.9 5.7 2.4 1.6 1.5 2.4 3.6 2.5 5.7 0 4.5-3.6 8.1-8.1 8.1-1.4 0-2.7-0.4-3.9-1l-4.4 1.1 1.2-4.2c-0.8-1.2-1.1-2.6-1.1-4 0-4.5 3.6-8.1 8.1-8.1zm0.1 1.5c-3.7 0-6.7 3-6.7 6.7 0 1.3 0.3 2.5 1 3.6l0.1 0.3-0.7 2.4 2.5-0.7 0.3 0.099c1 0.7 2.2 1 3.4 1 3.7 0 6.8-3 6.9-6.6 0-1.8-0.7-3.5-2-4.8s-3-2-4.8-2zm-3 2.9h0.4c0.2 0 0.4-0.099 0.5 0.3s0.5 1.5 0.6 1.7 0.1 0.2 0 0.3-0.1 0.2-0.2 0.3l-0.3 0.3c-0.1 0.1-0.2 0.2-0.1 0.4 0.2 0.2 0.6 0.9 1.2 1.4 0.7 0.7 1.4 0.9 1.6 1 0.2 0 0.3 0.001 0.4-0.099s0.5-0.6 0.6-0.8c0.2-0.2 0.3-0.2 0.5-0.1l1.4 0.7c0.2 0.1 0.3 0.2 0.5 0.3 0 0.1 0.1 0.5-0.099 1s-1 0.9-1.4 1c-0.3 0-0.8 0.001-1.3-0.099-0.3-0.1-0.7-0.2-1.2-0.4-2.1-0.9-3.4-3-3.5-3.1s-0.8-1.1-0.8-2.1c0-1 0.5-1.5 0.7-1.7s0.4-0.3 0.5-0.3z" />
                              </svg>
                            </div>
                            WhatsApp
                          </div>
                        </a>
                      </>
                    </div>
                    {expanded && <div></div>}
                    <div className="flexbutton" onClick={toggleRules}>
                      {expanded ? (
                        <a>
                          <ExpandLessOutlinedIcon /> Vazgeç{" "}
                          <ExpandLessOutlinedIcon />{" "}
                        </a>
                      ) : (
                        <a>
                          <ExpandMoreOutlinedIcon />
                          Koltuk seç
                          <ExpandMoreOutlinedIcon />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={`rules ${expanded ? "expanded" : ""}`}>
                    <div className="hole">
                      <label>Ticket Type</label>
                      <select
                        name="name"
                        id="Id"
                        value={ticketType}
                        onChange={(e) => {
                          setTicketType(e.target.value);
                          calculateTotalPrice(event.cost);
                        }}
                      >
                        <option value="" disabled selected>
                          Kategori Seçiniz
                        </option>
                        <option value="Serbest Oturma Düzeni">
                          Serbest Oturma Düzeni
                        </option>
                        <option value="Kategori 1">Kategori 1</option>
                        <option value="Kategori 2">Kategori 2</option>
                        <option value="Kategori 3">Kategori 3</option>
                        <option value="Kategori 4">Kategori 4</option>
                      </select>

                      <div className="seat-reservation">
                        <h2>Rezervasyon</h2>
                        <div className="stage">Sahne</div>
                        <div className="seats">
                          <div className="row">
                            <div
                              className={`seat ${
                                selectedSeats.includes("A1") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A1")}
                            >
                              A1
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A2") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A2")}
                            >
                              A2
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A3") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A3")}
                            >
                              A3
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A4") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A4")}
                            >
                              A4
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A5") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A5")}
                            >
                              A5
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A6") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A6")}
                            >
                              A6
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A7") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A7")}
                            >
                              A7
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A8") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A8")}
                            >
                              A8
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A9") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A9")}
                            >
                              A9
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("A10") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("A10")}
                            >
                              A10
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className={`seat ${
                                selectedSeats.includes("B1") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B1")}
                            >
                              B1
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B2") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B2")}
                            >
                              B2
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B3") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B3")}
                            >
                              B3
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B4") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B4")}
                            >
                              B4
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B5") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B5")}
                            >
                              B5
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B6") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B6")}
                            >
                              B6
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B7") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B7")}
                            >
                              B7
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B8") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B8")}
                            >
                              B8
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B9") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B9")}
                            >
                              B9
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("B10") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("B10")}
                            >
                              B10
                            </div>
                          </div>
                          <div className="balcony-row">
                            <div
                              className={`seat ${
                                selectedSeats.includes("C1") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C1")}
                            >
                              C1
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C2") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C2")}
                            >
                              C2
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C3") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C3")}
                            >
                              C3
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C4") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C4")}
                            >
                              C4
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C5") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C5")}
                            >
                              C5
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C6") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C6")}
                            >
                              C6
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C7") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C7")}
                            >
                              C7
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C8") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C8")}
                            >
                              C8
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C9") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C9")}
                            >
                              C9
                            </div>
                            <div
                              className={`seat ${
                                selectedSeats.includes("C10") ? "selected" : ""
                              }`}
                              onClick={() => handleSeatClick("C10")}
                            >
                              C10
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="selected-seats">
                        <h3>Seçilen Koltuklar:</h3>
                        <ul>
                          {selectedSeats.map((seat) => (
                            <li key={seat}>{seat}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="altdetails">
                      <div className="ticket-widget">
                        <div className="top">
                          <div className="bandname">{event.title}</div>
                          <div className="tourname">{event.venueName}</div>
                          <img
                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/concert.png"
                            alt=""
                          />
                          <div className="deetz">
                            <div className="price">
                              <div className="label">Tek Bilet Fiyatı</div>
                              <div className="cost">
                                <h3>{price} </h3>
                                <CurrencyLiraIcon fontSize="small" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rip"></div>
                        <div className="bottom">
                          <button
                            className="buy"
                            onClick={() => addTicket(event.eventID)}
                          >
                            BUY TICKET
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default TicketBuy;
