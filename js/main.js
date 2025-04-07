import months from "./contants.js";

// ! Html'deki elemanları Js kısmına çek
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

// Global Değişkenler
let notes = [];

// ! Güncelleme işlemi için gereken değişkenler
let isUpdate = false;
let updateId = null;

// ! addBox'a tıklanınca popup'ı görünür kıl
addBox.addEventListener("click", () => {
  // popupBoxContainer ve popupBox elemanlarına show classı ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  // Arkaplanın kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// ! closeBtn'e tıklanınca popup'ı eski haline çevir
closeBtn.addEventListener("click", () => {
  // popupBoxContainer ve popupBox elemanlarından show classını çıkar
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  // Arkaplanın kaydırılmasını aktif et
  document.querySelector("body").style.overflow = "auto";
});

// ! Formun gönderilmesini izle ve gönderilen formun içerisindeki değerlere eriş
form.addEventListener("submit", (e) => {
  // Sayfa yenilemeyi engelle
  e.preventDefault();

  // Formun içerisindeki elemanlara eriş
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  // Form içerisindeki elemanların değerlerine eriş
  let title = titleInput.value;
  let description = descriptionInput.value;

  // Title ve Description değerlerin olup olmadığını kontrol et
  if (!title && !description) {
    // Kullanıcıya uyarı ver
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");

    // Fonksiyonu durdur
    return;
  }

  // Bir note için gerekli olan title,description,date ve id değerlerini oluştur
  let date = new Date();

  let id = new Date().getTime();

  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  if (isUpdate) {
    // Güncelleme yapılacak elemanın index'ini notes dizisi içerisinden bul
    const noteIndex = notes.findIndex((note) => note.id == updateId);

    // Sırası bilinen elemanın bilgilerini notes dizisi içerisinde güncelle

    notes[noteIndex] = {
      title,
      description,
      id,
      date: `${month} ${day},${year} `,
    };

    // Güncelleme işlemi sonrası popup'ı kapat ve popup'ı eski haline çevir

    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    // Note objesi oluştur
    let noteInfo = {
      title,
      description,
      date: `${month} ${day},${year} `,
      id,
    };

    // notes dizisine oluşturulan note objesini ekle
    notes.push(noteInfo);
  }

  titleInput.value = "";
  descriptionInput.value = "";

  // popupBoxContainer ve popupBox elemanlarından show classını çıkar
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  // Arkaplanın kaydırılmasını aktif et
  document.querySelector("body").style.overflow = "auto";

  renderNotes();
});

// ! Note dizisindeki note'ları render eden fonksiyon
function renderNotes() {
  // Mevcut notları kaldır

  document.querySelectorAll(".note").forEach((item) => item.remove());

  // notes dizisini dön ve her note için bir html oluştur
  notes.forEach((note) => {
    let notesHtml = ` <li class="note" data-id='${note.id}'>
 
        <div class="details">
          <p class="title">${note.title} </p>
          <p class="description">${note.description}</p>
        </div>
  
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='editIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;

    // Oluşturulan note html'ini addBox elemanından sonra ekle
    addBox.insertAdjacentHTML("afterend", notesHtml);

    // ! insertAdjacentHTML bir öğeyi başka bir elemana göre (sonrasına,öncesine eklemek için kullanılır).Buradaki kullanımda wrapper içerisinde yer alan addBox elemanından sonra oluşturulan note elemanlarını eklemiş olduk
  });
}

// ! Sil ve Düzenle kısmını aktif eden fonksiyon
function showMenu(element) {
  // Show menu fonksiyonuna parametre olarak verilen iconun kapsayıcısına show classı ekle
  element.parentElement.classList.add("show");

  // Menu haricinde bir yere tıklanırsa parentElement'den show classını kaldır
  document.addEventListener("click", (e) => {
    // Eğer kapsam haricinde bir yere tıklandıysa
    if (e.target.tagName != "I" || e.target != element) {
      element.parentElement.classList.remove("show");
    }
  });
}

// ! Wrapper kısmındaki tıklanmaları izle
wrapper.addEventListener("click", (e) => {
  // Eğer ...'ya tıklandıysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Eğer sil butonuna tıklandıysa
  else if (e.target.classList.contains("deleteIcon")) {
    // Kullanıcıdan silme işlemi için onay al
    const response = confirm("Bu notu silmek istediğinize eminmisiniz ?");

    // Eğer silme işlemi onaylandıysa
    if (response) {
      // Tıklanılan note elemanına eriş
      const note = e.target.closest(".note");

      // Note'un içerisindeki id'ye eriş ve bunu number tipine çevir
      const noteId = parseInt(note.dataset.id);

      // Id'si bilinen note elemanını notes dizisinden kaldır
      notes = notes.filter((note) => note.id != noteId);

      // Noteları render et
      renderNotes();
    }
  }
  // Eğer düzenle butonuna tıklandıysa
  else if (e.target.classList.contains("editIcon")) {
    // Tıklanılan note elemanına eriş
    const note = e.target.closest(".note");
    // Güncellenecek notun idsine eriş
    const noteId = parseInt(note.dataset.id);
    // Notes dizisi içerisinde güncellenecek note'un bilgilerini bul
    const foundedNote = notes.find((note) => note.id == noteId);
    // popup'ı aktif et
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    // Güncelleme moduna geç
    isUpdate = true;
    updateId = noteId;
    // popup içerisindeki inputlara düzenleme yapılan note'un bilgilerini geç
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // Popup içerisindeki başlık ve butonun içeriği güncelle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});