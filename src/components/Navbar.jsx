import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "./context/GlobalContext";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ticket from "./media/ticket.png";
import Tiyatro from "./media/Tiyatro.png";
import Spor from "./media/Spor.png";
import Konser from "./media/Konser.png";
import Festival from "./media/Festival.png";
import Stand from "./media/Stand Up.png";
import Cocuk from "./media/Cocuk Aktiviteleri.png";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

function Navbar() {
  const [searchItem, setSearchItem] = useState("");
  const [categories, setCategories] = useState([]);

  const { favoriler } = useContext(AppContext);
  const navigate = useNavigate();

  function categoryimg(categoryId) {
    switch (categoryId) {
      case 1:
        return Tiyatro;
      case 2:
        return Spor;
      case 3:
        return Konser;
      case 4:
        return Festival;
      case 5:
        return Stand;
      case 6:
        return Cocuk;

      default:
        return null;
    }
  }

  const loadCategories = () => {
    axios
      .get("https://localhost:7280/api/Category")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error("An error occurred while loading categories:", error);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      <div className="nav">
        <div className="navstart">
          <NavLink aria-current="page" to="/">
            <img src={ticket} alt="" />
          </NavLink>
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Etkinlik, sanatçı veya mekan arayın...."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              onKeyDown={() => navigate(`/event/${searchItem}`)}
            />

            <button
              onClick={() => navigate(`/event/${searchItem}`)}
              href="#"
              className="search-icon"
            >
              <SearchIcon />
            </button>
            <div className="favorite">
              <NavLink aria-current="page" to="/takip">
                Kayıt edilen
                <BookmarksIcon fontSize="large" />{" "}
                <span className="hot">{favoriler.length}</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="row">
          {categories.map((category) => (
            <NavLink
              to={`event/${category.name}`}
              activeClassName="active"
              key={category.categoryId}
            >
              <div className="col">
                <div className="card-inner clickable">
                  <img
                    src={categoryimg(category.categoryId)}
                    width={50}
                    alt={category.name}
                  />
                  <div className="text-center mg-text">
                    <span>{category.name}</span>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default Navbar;
