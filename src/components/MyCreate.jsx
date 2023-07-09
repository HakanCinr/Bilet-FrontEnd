import axios from 'axios'
import React, { useEffect, useState } from 'react'


function MyCreate() {
  const [event, setEvent] = useState([])
  const [category, setCategory] = useState([])
  const [eventid, setEventid] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startdate, setStartdate] = useState(new Date().toISOString().split('T')[0])
  const [enddate, setEnddate] = useState(new Date().toISOString().split('T')[0])
  const [venueName, setVenueName] = useState("")
  const [address, setAddress] = useState("")
  const [googleMapsLink, setGoogleMapsLink] = useState("")
  const [image, setImage] = useState([])
  const [imageID, setimageID] = useState("")
  const [eventID, setEventID] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [posterurl, setPosterurl] = useState("")
  const [genre, setGenre] = useState("")
  const [cost, setcost] = useState("")

  const loadImages = () => {
    axios.get("https://localhost:7280/api/Image")
      .then(res => {
        setImage(res.data)
      })
      .catch(error => {
        console.error("Görseller yüklenirken bir hata oluştu:", error)
      })
  }

  useEffect(() => {
    loadImages()
  }, [])

  const deleteImage = (id) => {
    axios.delete(`https://localhost:7280/api/Image/${id}`)
      .then(res => {
        loadImages()
      })
      .catch(error => {
        console.error("Görsel silinirken bir hata oluştu:", error)
      })
  }

  const addImage = () => {
    const data = {
      eventID: eventID,
      posterurl: posterurl,
      imageURL: imageURL
    }
    axios.post("https://localhost:7280/api/Image", data)
      .then(res => {
        alert("Görsel başarıyla Eklendi.")
        loadImages()
      })
      .catch(error => {
        console.error("Görsel eklenirken bir hata oluştu:", error)
      })
  }

  const updateImage = (id) => {
    const filteredImage = image.find(item => item.imageID === id)
    if (filteredImage) {
      const updatedImage = {
        eventID: eventID !== "" ? eventID : filteredImage.eventID,
        posterurl: posterurl !=="" ? posterurl : filteredImage.cost,
        imageURL: imageURL !== "" ? imageURL : filteredImage.imageURL
      }
      axios.put(`https://localhost:7280/api/Image/${id}`, updatedImage)
        .then(res => {
          alert("Görsel başarıyla güncellendi.")
          loadImages()
        })
        .catch(error => {
          console.error("Görsel güncellenirken bir hata oluştu:", error)
        })
    } else {
      alert("Belirtilen ID'ye sahip görsel bulunamadı.")
    }
  }

  const loadCategory = () => {
    axios.get("https://localhost:7280/api/Category")
      .then(res => {
        setCategory(res.data)
      })
      .catch(error => {
        console.error("Kategori yüklenirken bir hata oluştu:", error)
      })
  }

  useEffect(() => {
    loadCategory()
  }, [])

  const loadEvents = () => {
    axios.get("https://localhost:7280/api/Event")
      .then(res => {
        setEvent(res.data)
      })
      .catch(error => {
        console.error("Etkinlikler yüklenirken bir hata oluştu:", error)
      })
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const addEvent = () => {
    let newEvent = {
      categoryId: categoryId,
      title: title,
      description: description,
      startdate: startdate,
      enddate: enddate,
      genre: genre,
      cost:cost,
      venueName: venueName,
      address: address,
      googleMapsLink: googleMapsLink
    }

    axios.post("https://localhost:7280/api/Event", newEvent)
      .then(() => {
        alert("Etkinlik başarıyla eklendi.")
        loadEvents()
      })
      .catch(error => {
        console.error("Etkinlik eklenirken bir hata oluştu:", error)
      })
  }

  const updateEvent = (id) => {
    const filteredEvent = event.find(item => item.eventID === id);
    if (filteredEvent) {
      const updatedEvent = {
        ...filteredEvent,
        categoryID: categoryId !== "" ? categoryId : filteredEvent.categoryID,
        title: title !== "" ? title : filteredEvent.title,
        description: description !== "" ? description : filteredEvent.description,
        startdate: startdate !== "" ? startdate : filteredEvent.startdate, 
        enddate: enddate !== "" ? enddate : filteredEvent.enddate, 
        genre: genre !== "" ? genre : filteredEvent.genre, 
        cost: cost !== "" ? cost : filteredEvent.cost, 
        venueName: venueName !== "" ? venueName : filteredEvent.venueName,
        address: address !== "" ? address : filteredEvent.address,
        googleMapsLink: googleMapsLink !== "" ? googleMapsLink : filteredEvent.googleMapsLink
      };
  
      axios.put(`https://localhost:7280/api/Event/${id}`, updatedEvent)
        .then(res => {
          alert("Etkinlik başarıyla güncellendi.");
          loadEvents();
        })
        .catch(error => {
          console.error("Etkinlik güncellenirken bir hata oluştu:", error);
        });
    } else {
      alert("Belirtilen ID'ye sahip etkinlik bulunamadı.");
    }
  };
  

  const deleteEvent = (eventid) => {
    axios.delete(`https://localhost:7280/api/Event/${eventid}`)
      .then(() => {
        alert("Etkinlik başarıyla silindi.")
        loadEvents()
      })
      .catch(error => {
        console.error("Etkinlik silinirken bir hata oluştu:", error)
      })
  }

  return (
    <>





      <div className="form-main">
        <div className='listevent'>
        <div>
        <label htmlFor="categoryId">Choose a category:</label>
        <select name="name" id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {category && category.map(item =>
            <option key={item.categoryId} value={item.categoryId}>{item.name}</option>
          )}
         </select>
        </div>
        <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></div>

        <div>
        <label>Start Date:</label>
        <input type="date" value={startdate} onChange={(e) => setStartdate(e.target.value)} />        
        <label>End Date:</label>
        <input type="date" value={enddate} onChange={(e) => setEnddate(e.target.value)} />
        </div>

        <div>
        <label>Venue Name:</label>
        <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} /></div>
        
        <div>
        <label>Genre:</label>
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
        
        <div>
        <label>Cost:</label>
        <input type="text" value={cost} onChange={(e) => setcost(e.target.value)} /></div>
        <div>       
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} /></div> 
        <div>
        <label>Google Maps Link:</label>
        <input type="text" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} /></div>
        <button onClick={addEvent}>Add</button>
      </div>

      <div className='listevent'>           
      <div>
        <label htmlFor="eventId">Choose a Event:</label>
        <select name="name" id="eventId" value={eventID} onChange={(e) => setEventID(e.target.value)}>
  {event && event.reverse().map(item =>
    <option key={item.eventID} value={item.eventID}>{item.title}</option>
  )}
</select>

      </div>

<div>
<label >İmage Url</label><input type='text' value={imageURL} onChange={(e)=>setImageURL(e.target.value)}  ></input>
<div>
<label >Poster İmage Url</label><input type='text' value={posterurl} onChange={(e)=>setPosterurl(e.target.value)}  ></input>
<button onClick={()=>addImage(imageID)} >Add</button></div></div>
      </div>
     
      </div>

      <div className="event-main">
            {event.map((event) => (
              <div className="event-list">
                <div className="wrapper" key={event.eventID}>
                  
                    <div className="card">
                      <div className="poster">
                     
                <img src={event.imageURL} alt={event.title} />
  
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
                      
                      
                    </div>
                    
                      
                   
                  </div>
                </div>
              </div>
            ))}
          </div>

    </>
  )
}

export default MyCreate;
