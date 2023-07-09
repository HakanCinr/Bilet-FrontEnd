import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { AppContext } from "./context/GlobalContext";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import BookmarkRemoveTwoToneIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import axios from "axios";

function Search() {
  const { searchItem } = useParams("");
  const [events, setEvents] = useState([]);
  const [filter, setfilter] = useState([]);
  const [detail, setdetail] = useState(false);
  const [defaultImageURL, setdefaultImageURL] = useState(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/concert.png"
  );
  
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const navigate = useNavigate();
  const { favoriler, favorilereEkle, favorilerdenCikar } =
    useContext(AppContext);

  const favoriKontrol = (id) => {
    const secim = favoriler.some((u) => u.eventID === id);
    return secim;
  };

  const toggleRules = () => {
    setdetail(!detail);
  };

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

  useEffect(() => {
    const filtered = events.filter(
      ({ title, venueName, categoryName, description, address }) => {
        return (
          title.toLowerCase().includes(searchItem.toLowerCase()) ||
          venueName.toLowerCase().includes(searchItem.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchItem.toLowerCase()) ||
          description.toLowerCase().includes(searchItem.toLowerCase()) ||
          address.toLowerCase().includes(searchItem.toLowerCase())
        );
      }
    );
    setfilter(filtered);
  }, [searchItem, events]);

  const filterDataByDate = () => {
    const filteredData = events.filter((item) => {
      const itemDate = new Date(item.startDate);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
    setfilter(filteredData);
  };

  return (
    <>
      <div className="detiallist">
        <button className="detialbutton">
          {detail && <div></div>}
          <div className="detialbutton" onClick={toggleRules}>
            {detail ? <p> Vazgeç </p> : <p>Detaylı arama</p>}
          </div>
        </button>
        <div className={`rules ${detail ? "detail" : ""}`}>
          <div className="date-search">
            <div>
              <label>Başlangıç tarihi</label>
              <input
                type="date"
                value={startDate}
                className="date-input"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>Bitiş tarihi</label>
              <input
                type="date"
                value={endDate}
                className="date-input"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button className="button" onClick={filterDataByDate}>
              Filtrele
            </button>
          </div>
        </div>{" "}
        <h2> " {searchItem} "</h2>&nbsp;<h2>&nbsp; Arama Sonuçları </h2>
      </div>

      <div className="event-main">
        {filter &&
          filter.map((event) => (
            <div className="event-list">
              <div className="wrapper" key={event.eventID}>
                <div
                  className="card"
                  onClick={() => navigate(`/ticket/${event.eventID}`)}
                >
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
    </>
  );
}

export default Search;
