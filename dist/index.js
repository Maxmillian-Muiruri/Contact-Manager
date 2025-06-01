"use strict";
class Contact {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
class ContactManager {
    constructor() {
        this.contacts = [];
        this.loadContacts();
    }
    saveContacts() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }
    loadContacts() {
        const data = localStorage.getItem("contacts");
        this.contacts = data ? JSON.parse(data) : [];
    }
    createContact(id, name, email, phone) {
        if (this.contacts.some((c) => c.id === id))
            return null;
        const contact = new Contact(id, name, email, phone);
        this.contacts.push(contact);
        this.saveContacts();
        return contact;
    }
    updateContact(id, name, email, phone) {
        const contact = this.contacts.find((c) => c.id === id);
        if (contact) {
            contact.name = name;
            contact.email = email;
            contact.phone = phone;
            this.saveContacts();
            return true;
        }
        return false;
    }
    deleteContact(id) {
        const index = this.contacts.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.contacts.splice(index, 1);
            this.saveContacts();
            return true;
        }
        return false;
    }
}
const contactManager = new ContactManager();
function getElement(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element with id ${id} not found`);
    return element;
}
function renderContacts(contacts) {
    const container = getElement("contactsList");
    const contactsToRender = contacts || contactManager.contacts;
    // Update contact count
    getElement("contactCount").textContent =
        contactsToRender.length.toString();
    if (contactsToRender.length === 0) {
        container.innerHTML = `<div class="empty-state">
      <i class="fas fa-user-slash"></i>
      <h3>No Contacts Found</h3>
      <p>${contacts
            ? "No matches for your search"
            : "Add your first contact using the form above"}</p>
    </div>`;
        return;
    }
    container.innerHTML = contactsToRender
        .map((c) => `<div class="contact-card">
        <b>${c.name}</b> (ID: ${c.id})<br>
        <span class="contact-info"><i class="fas fa-envelope"></i> ${c.email}</span><br>
        <span class="contact-info"><i class="fas fa-phone"></i> ${c.phone}</span>
      </div>`)
        .join("");
}
function handleSearch() {
    const searchTerm = getElement("contactSearch").value.toLowerCase();
    const filteredContacts = contactManager.contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm) ||
        contact.id.toString().includes(searchTerm));
    renderContacts(filteredContacts);
}
function handleRefresh() {
    // Clear search input
    getElement("contactSearch").value = "";
    // Clear form inputs
    getElement("contactId").value = "";
    getElement("contactName").value = "";
    getElement("contactEmail").value = "";
    getElement("contactPhone").value = "";
    // Reload contacts from storage and re-render
    contactManager.loadContacts();
    renderContacts();
}
function handleCreateContact() {
    const id = parseInt(getElement("contactId").value);
    const name = getElement("contactName").value.trim();
    const email = getElement("contactEmail").value.trim();
    const phone = getElement("contactPhone").value.trim();
    if (!id || !name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }
    const created = contactManager.createContact(id, name, email, phone);
    if (!created) {
        alert("A contact with this ID already exists.");
        return;
    }
    renderContacts();
}
function handleUpdateContact() {
    const id = parseInt(getElement("contactId").value);
    const name = getElement("contactName").value.trim();
    const email = getElement("contactEmail").value.trim();
    const phone = getElement("contactPhone").value.trim();
    if (!id || !name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }
    if (!contactManager.updateContact(id, name, email, phone)) {
        alert("Contact not found.");
        return;
    }
    renderContacts();
}
function handleDeleteContact() {
    const id = parseInt(getElement("contactId").value);
    if (!id) {
        alert("Please enter the Contact ID to delete.");
        return;
    }
    if (!contactManager.deleteContact(id)) {
        alert("Contact not found.");
        return;
    }
    renderContacts();
}
document.addEventListener("DOMContentLoaded", () => {
    getElement("createContactBtn").addEventListener("click", handleCreateContact);
    getElement("updateContactBtn").addEventListener("click", handleUpdateContact);
    getElement("deleteContactBtn").addEventListener("click", handleDeleteContact);
    getElement("refreshAllBtn").addEventListener("click", handleRefresh);
    getElement("contactSearch").addEventListener("input", handleSearch);
    renderContacts();
});
