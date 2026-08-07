
class Dir {
  static #nextId = 1;

  constructor(title = "", id) {
    let assignedId;

    if (id !== undefined && id > Dir.#nextId) {
      assignedId = id;
      Dir.#nextId = id + 1;
    } else {
      assignedId = Dir.#nextId++;
    }

    Object.defineProperty(this, "id", {
      value: assignedId,
      writable: false,
      configurable: false,
      enumerable: true
    });

    this.title = title;
    this.childDirs = [];
    this.parent = null;
  }

  addDir(titleOrDir) {
    let dirObj;

    if (titleOrDir instanceof Dir) {
      dirObj = titleOrDir;
    } else if (typeof titleOrDir === "string") {
      dirObj = new Dir(titleOrDir);
    } else {
      throw new Error("Tham số phải là string (title) hoặc instance của Dir");
    }

    // Kiểm tra trùng tiêu đề (title) với các thư mục con hiện tại
    const isDuplicate = this.childDirs.some(
      (child) => child.title === dirObj.title && child !== dirObj
    );

    if (isDuplicate) {
      console.warn(`Cảnh báo: Thư mục trùng tên "${dirObj.title}" đã tồn tại trong "${this.title}".`);
      return null;
    }

    if (dirObj.parent) {
      dirObj.parent.removeDir(dirObj);
    }

    dirObj.parent = this;
    this.childDirs.push(dirObj);
    return dirObj;
  }

  removeDir(idOrDir) {
    const index = this.childDirs.findIndex((child) => {
      if (idOrDir instanceof Dir) {
        return child === idOrDir;
      }
      return child.id === idOrDir;
    });

    if (index !== -1) {
      const [removed] = this.childDirs.splice(index, 1);
      removed.parent = null;
      return removed;
    }

    return null;
  }

  setTitle(title) {
    this.title = title;
  }

  getPath() {
    const pathSegments = [];
    let current = this;

    while (current) {
      pathSegments.unshift(current.title);
      current = current.parent;
    }

    return pathSegments.join("/");
  }

  findDir(id) {
    if (this.id === id) return this;

    for (const child of this.childDirs) {
      const found = child.findDir(id);
      if (found) return found;
    }

    return null;
  }

  stringify() {
    return JSON.stringify(this, (key, value) => {
      if (key === "parent") return undefined;
      return value;
    });
  }

  static revive(dirJson) {
    const data = typeof dirJson === "string" ? JSON.parse(dirJson) : dirJson;
    const dir = new Dir(data.title, data.id);

    if (Array.isArray(data.childDirs)) {
      for (const childData of data.childDirs) {
        const childInstance = Dir.revive(childData);
        childInstance.parent = dir;
        dir.childDirs.push(childInstance);
      }
    }

    return dir;
  }
}
