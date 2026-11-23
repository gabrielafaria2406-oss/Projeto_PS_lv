
export default class CommunicationStyle {
  constructor(id, name, title, description, tip) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.description = description;
    this.tip = tip;

    Object.freeze(this);
  }
}
