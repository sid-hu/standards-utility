import * as pb from "../proto/local/data_pb"
import { Box } from "./generic"

export class Piece extends pb.Piece {
  constructor(o: pb.Piece.AsObject) {
    super()
    this.setId(o.id)
    this.setName(o.name)
    this.setAuthor(o.author)
    this.setPagesList(o.pagesList.map(p => new Page(p)))
  }
}

//measure data

export class Measures extends pb.Measures {
  constructor(o: pb.Measures.AsObject) {
    super()
    if (o.bounds) {
      this.setBounds(new Box(o.bounds))
    }
    this.setRowsList(o.rowsList.map(r => new Row(r)))
  }
}

export class Row extends pb.Row {
  constructor(o: pb.Row.AsObject) {
    super()
    this.setOffset(o.offset)
    this.setThickness(o.thickness)
    this.setLinesList(o.linesList)
  }
}

//practice data

export class Page extends pb.Page {
  constructor(o: pb.Page.AsObject) {
    super()
    this.setImage(o.image)
    if (o.measures) {
      this.setMeasures(new Measures(o.measures))
    }
    this.setSectionsList(o.sectionsList.map(s => new Section(s)))
  }
}

export class Section extends pb.Section {
  constructor(o: pb.Section.AsObject) {
    super()
    this.setMeasuresList(o.measuresList)
    this.setTasksList(o.tasksList.map(t => new Task(t)))
  }
}

export class Task extends pb.Task {
  constructor(o: pb.Task.AsObject) {
    super()
    this.setToolsList(o.toolsList)
    if (o.state) {
      this.setState(new TaskState(o.state))
    }
  }
}

//task state variants
export class SingleState extends pb.SingleState {
  constructor(o: pb.SingleState.AsObject) {
    super()
    this.setCompleted(o.completed)
  }
}

export class HandsSeparate extends pb.HandsSeparate {
  constructor(o: pb.HandsSeparate.AsObject) {
    super()
    this.setLeft(o.left)
    this.setRight(o.right)
  }
}

export class TaskState extends pb.TaskState {
  constructor(o: pb.TaskState.AsObject) {
    super()
    if (o.handsseparate) {
      this.setHandsseparate(new HandsSeparate(o.handsseparate))
    }
    if (o.handstogether) {
      this.setHandstogether(new SingleState(o.handstogether))
    }
    if (o.eyesclosed) {
      this.setEyesclosed(new SingleState(o.eyesclosed))
    }
    if (o.memorized) {
      this.setMemorized(new SingleState(o.memorized))
    }
  }
}
