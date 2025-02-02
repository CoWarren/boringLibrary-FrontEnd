import React, { useState, useEffect } from "react";
import {
  addToFavourites,
  removeFavourite,
} from "../Utilities/favouritesFunction";

const Favourites = ({
  updateFavourite,
  setUpdateFavourite,
  favorites,
  setFavorites,
  setPage,
}) => {
  const [wishList, setWishList] = useState([]);
  const [readList, setReadList] = useState([]);
  const [filteredRead, setFilteredRead] = useState(false);
  const [filteredWishList, setFilteredWishList] = useState(false);
  const [favSearch, setFavSearch] = useState([]);
  const [favSearchState, setFavSearchState] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/users/${sessionStorage.getItem("userId")}`)
      .then((res) => res.json())
      .then((data) => {
        return setFavorites(data);
      }); //getting error here in console though it doesn't stop any functionality

    // two more api request one to remove from the database
    //(needs to be a route or this could work on the same route which would add if book is not in, and remove if book is in)
    fetch(
      `http://localhost:8080/users/get/wishList/${sessionStorage.getItem(
        "userId"
      )}`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        setWishList(data);
      });
    fetch(
      `http://localhost:8080/users/get/readList/${sessionStorage.getItem(
        "userId"
      )}`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        setReadList(data);
      });
  }, [updateFavourite]); //(JSON ERROR)

  async function editWishList(bookId) {
    fetch(
      `http://localhost:8080/users/${sessionStorage.getItem(
        "userId"
      )}/${bookId}/wishList`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setWishList(data);
      })
      .then(function () {
        setUpdateFavourite(updateFavourite + 1);
      });
  }

  async function editReadList(bookId) {
    fetch(
      `http://localhost:8080/users/${sessionStorage.getItem(
        "userId"
      )}/${bookId}/readList`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReadList(data);
      })
      .then(function () {
        setUpdateFavourite(updateFavourite + 1);
      });
  }

  function handleReadFilter() {
    if (filteredRead === true) {
      setFilteredRead(false);
    }
    if (filteredRead === false) {
      setFilteredRead(true);
    }
  }

  function handleWishListFilter() {
    if (filteredWishList === true) {
      setFilteredWishList(false);
    }
    if (filteredWishList === false) {
      setFilteredWishList(true);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (e.target[0].value === "") {
      setFavSearchState(false);
    } else {
      fetch(
        `http://localhost:8080/users/${sessionStorage.getItem(
          "userId"
        )}/favourites/${e.target[0].value}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((data) => {
          setFavSearch(data.map((obj) => obj.id));
          setFavSearchState(true);
        });
    }
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="fav-container flex-column">
      <div className="fav-header flex-column">
        <div className="fav-header-title">
          <h1>Favourites</h1>
        </div>
        <div className="fav-searchbar-container flex">
          <div className="fav-searchbar-form-container flex">
            <form
              action=""
              onSubmit={handleSearch}
              className="favourite-searchbar-form flex"
            >
              <input
                className="search-favs"
                placeholder="Search through your favourites"
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="fav-form-filter-dropdown">
            <button type="button" onClick={handleOpen}>
              Filters
            </button>
            {open ? (
              <ul className="menu">
                <li className="menu-item">
                  <button onClick={handleReadFilter}>
                    {!filteredRead
                      ? "filter books marked as read"
                      : "filtered by read"}
                  </button>
                </li>
                <li className="menu-item">
                  <button onClick={handleWishListFilter}>
                    {!filteredWishList
                      ? "filter books marked on wishlist"
                      : "filtered by wishlist"}
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <div className="fav-books flex">
        {favorites.length === 0 && (
          <h2 className="errorText">No favourites to display</h2>
        )}

        {favorites.map(function (book) {
          if (
            !filteredWishList ||
            (filteredWishList && wishList.includes(book.id))
          ) {
            if (!filteredRead || (filteredRead && readList.includes(book.id))) {
              if (
                !favSearchState ||
                (favSearchState && favSearch.includes(book.id))
              ) {
                return (
                  <div key={book.id} className="fav-book-container flex-column">
                    
                    <div className="book-thumbnail-container flex">
                      <img src={book.thumbnail} />
                    </div>
                    <div className="book-info-container flex-column">
                       <div className="book-title-container">      
                     <h2>{book.title}</h2>
                    </div>
                    <div className="book-author-container">
                      <h2>{book.author}</h2>
                    </div>
                    <div className="book-btns-container flex-column">
                    <section className="filter-buttons">
                      <button
                        onClick={function () {
                          editReadList(book.id);
                        }}
                      >
                        {readList.includes(book.id)
                          ? "remove from to read list"
                          : "add to read list"}
                      </button>
                      <button
                        onClick={function () {
                          editWishList(book.id);
                        }}
                      >
                        {wishList.includes(book.id)
                          ? "remove from wish list"
                          : "Add to wish list"}
                      </button>
                    </section>
                    <div className="fav-btns-container">
                   <button
                      className="fav-button"
                      onClick={function (event) {
                        removeFavourite(
                          event,
                          book.id,
                          updateFavourite,
                          setUpdateFavourite,
                          favorites,
                          setFavorites
                        );
                      }}
                    >
                      REMOVE FROM FAVOURITES ❌
                    </button>
                   </div>
                    </div>

                   
                    
                    </div>
                   
                   
                  </div>
                );
              }
            }
          }
        })}
      </div>
    </div>
  );
};

export default Favourites;
