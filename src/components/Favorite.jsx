import React, { useContext, useState } from "react";
import { AppContext } from "./context/GlobalContext";
import { useNavigate, Link } from "react-router-dom";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import BookmarkRemoveTwoToneIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

function Favorite({ data }) {


  const [defaultImageURL, setdefaultImageURL] = useState("https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/concert.png")
  const { favoriler, favorilereEkle, favorilerdenCikar } =
    useContext(AppContext);

  const favoriKontrol = (id) => {
    const secim = favoriler.some((u) => u.id === id);
    return secim;
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="event-main">
        {favoriler.map((event) => (
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
                <div
                  className="select"
                  onClick={() => favorilerdenCikar(event.eventID)}
                >
                  Takipten çıkar
                  <BookmarkRemoveTwoToneIcon fontSize="large" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Favorite;
