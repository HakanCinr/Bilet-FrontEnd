import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./context/GlobalContext";
import axios from "axios";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import BookmarkRemoveTwoToneIcon from "@mui/icons-material/BookmarkRemoveTwoTone";

function Mybody() {
  const [events, setEvents] = useState([]);
  const [defaultImageURL, setdefaultImageURL] = useState("https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/concert.png")
  const [olddateevent, setolddateevent] = useState([]);
  const [comingdateEvent, setcomingdateEvent] = useState([]);
  const [trentevent, settrentevent] = useState([]);
  const [activeItem, setActiveItem] = useState(0);

  const { favoriler, favorilereEkle, favorilerdenCikar } =
    useContext(AppContext);

  const favoriKontrol = (eventID) => {
    const secim = favoriler.some((u) => u.eventID === eventID);
    return secim;
  };

  useEffect(() => {
    const filtered = events.filter((event) => {
      const endDate = new Date(event.endDate);
      const currentDate = new Date();
      return endDate <= currentDate;
    });
    setolddateevent(filtered);
  }, [events]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const endDate = new Date(event.endDate);
      const currentDate = new Date();
      return endDate >= currentDate;
    });
    setcomingdateEvent(filtered);
  }, [events]);

  useEffect(() => {
    const filtered = events.slice(-5);
    settrentevent(filtered);
  }, [events]);

  const loadEvents = () => {
    axios
      .get("https://localhost:7280/api/Event")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((error) => {
        console.error("An error occurred while loading events:", error);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <>
      <div>
        <div className="cominglist">
          <section className="evently-section">
            <h2 className="line-title">Son Eklenen 5 Etkinlik</h2>
            <div
              className="owl-carousel custom-carousel owl-theme"
              style={{ display: "flex" }}
            >
              {trentevent.map((item, index) => (
                <div     key={index}     className={`item ${activeItem === index ? "active" : ""}`} 
                style={{ backgroundImage:  `url(${item.imageURL || defaultImageURL})` }}  
                  onClick={() => handleItemClick(index)}  >
    
                  <div className="item-desc">
                    <h3>{item.title}</h3>
                    <p>{item.description.slice(0, 80)}...</p>
                    <div className="eventselect">
                      <Link to={`/ticket/${item.eventID}`}>
                        {" "}
                        <div className="select">
                          {" "}
                          <h4>{item.cost} TL </h4>
                          <ConfirmationNumberIcon />
                        </div>{" "}
                      </Link>
                      {favoriKontrol(item.eventID) ? (
                        <div
                          className="select"
                          onClick={() => favorilerdenCikar(item.eventID)}
                        >
                          Takipten çık
                          <BookmarkRemoveTwoToneIcon />
                        </div>
                      ) : (
                        <div
                          className="select"
                          onClick={() => favorilereEkle(item)}
                        >
                          Takibe Al
                          <BookmarkAddRoundedIcon />
                        </div>
                      )}{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="aktiflist">
          <h2>Yakında</h2>
          <div className="event-main">
            {comingdateEvent.map((event) => (
              <div className="event-list">
                <div className="wrapper" key={event.eventID}>
                  <Link to={`/ticket/${event.eventID}`}>
                    <div className="card">
                      <div className="poster">
                      {event.imageURL ? (
                <img src={event.imageURL} alt={event.title} />
              ) : (
                <img src={defaultImageURL} alt="Default" />
              )}
                        
                      </div>
                      <div className="details">
                        <h2>{event.title}</h2>

                        <div className="tags">
                          <span className="tag">{event.venueName}</span>
                          <span className="tag">{event.categoryName}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="eventselect">
                    <div className="select">
                      {" "}
                      <h4>{event.cost} TL </h4>
                      <ConfirmationNumberIcon fontSize="medium" />
                    </div>
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
                    )}{" "}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="oldlist">
          <h2>Geçmiş Etkinlikler</h2>

          <div className="event-main">
            {olddateevent.map((event) => (
              <div className="event-list">
                <div className="wrapper" key={event.eventID}>
                  <Link to={`/ticket/${event.eventID}`}>
                    <div className="card">
                      <div className="poster">
                      {event.imageURL ? (
                <img src={event.imageURL} alt={event.title} />
              ) : (
                <img src={defaultImageURL} alt="Default" />
              )}
                      </div>
                      <div className="details">
                        <h2>{event.title}</h2>

                        <div className="tags">
                          <span className="tag">{event.venueName}</span>
                          <span className="tag">{event.categoryName}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="eventselect">
                    <div className="select">
                      {" "}
                      <h4>{event.cost} TL </h4>
                      <ConfirmationNumberIcon />
                    </div>
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
                    )}{" "}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Mybody;
