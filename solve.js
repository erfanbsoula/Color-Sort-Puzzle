let Solution = [];

class Move {
    loc;
    dst;

    constructor(loc_, dst_) {
        this.loc = loc_;
        this.dst = dst_;
    }

    is_reverse(move) {
        return this.loc == move.dst && this.dst == move.loc;
    }
}

class Log {
    color;
    count;

    constructor(color_, count_) {
        this.color = color_
        this.count = count_
    }
}

class Bottle extends Array {
    is_sorted() {
        for(let i = 1; i < this.length; i++)
            if(this[i] != this[0])
                return false;
        return true;
    }

    is_partially_sorted() {
        if(this[0] == 0)
            return false;
        for(let i = 1; i < this.length; i++)
            if(this[i] != this[0] && this[i] != 0)
                return false;
        return true;
    }

    is_empty() {
        for(let i = 0; i < this.length; i++)
            if(this[i] != 0)
                return false;
        return true;
    }

    empty_space_count() {
        let count = 0;
        for(let i = this.length-1; i >= 0; i--) {
            if(this[i] == 0)
                count += 1;
            else break;
        }
        return count;
    }

    last() {
        for(let i = this.length-1; i > 0; i--)
            if(this[i] != 0)
                return this[i];
        return this[0];
    }

    last_count() {
        let last = this.last();
        let count = 0;
        for(let i = this.length-1; i >= 0; i--) {
            if(this[i] == last)
                count += 1;
            else if(this[i] != 0)
                break;
        }
        return count;
    }

    pour_in(color, count) {
        for(let i = 0; i < this.length && count > 0; i++) {
            if(this[i] == 0) {
                this[i] = color;
                count -= 1;
            }
        }
    }

    pour_last_out() {
        let last = this.last();
        for(let i = this.length-1; i >= 0; i--) {
            if(this[i] == last)
                this[i] = 0;
            else if(this[i] != 0)
                break;
        }
    }
}

class State extends Array {
    is_sorted() {
        for(let i = 0; i < this.length; i++)
            if(!this[i].is_sorted())
                return false;
        return true;
    }

    find_dsts_for(bottle_index) {
        let dsts = [];
        if(this[bottle_index].is_sorted())
            return dsts;
        let empty_flag = !this[bottle_index].is_partially_sorted();
        let empty_bottle = -1;
        for(let i = 0; i < this.length; i++) {
            if(i == bottle_index)
                continue;
            if(this[i].is_empty()) {
                if(empty_flag) {
                    dsts.push(i);
                    empty_flag = false;
                    empty_bottle = i;
                }
            }
            else if(this[i].last() == this[bottle_index].last())
                if(this[i].empty_space_count() >= this[bottle_index].last_count())
                    dsts.push(i);
        }
        if(empty_bottle != -1 && dsts.length > 1) {
            let index = dsts.indexOf(empty_bottle);
            dsts.splice(index, 1);
        }
        return dsts;
    }

    remove_identical_moves(moves) {
        let exess_list = [];
        for(let i = 0; i < moves.length; i++) {
            for(let j = i+1; j < moves.length; j++) {
                if(moves[j].is_reverse(moves[i]))
                    if (this[moves[i].loc].is_partially_sorted() &&
                        this[moves[i].dst].is_partially_sorted())
                        exess_list.push(j);
            }
        }
        exess_list.sort(function(a, b){return b-a});
        for(let i = 0; i < exess_list.length; i++)
            moves.splice(exess_list[i], 1);
        return moves;
    }

    find_moves() {
        let moves = [];
        for(let i = 0; i < this.length; i++) {
            let dsts = this.find_dsts_for(i);
            for(let j = 0; j < dsts.length; j++)
                moves.push(new Move(i, dsts[j]));
        }
        return this.remove_identical_moves(moves)
    }

    make_move(move) {
        let log = new Log(this[move.loc].last(), this[move.loc].last_count());
        this[move.dst].pour_in(log.color, log.count);
        this[move.loc].pour_last_out();
        return log;
    }

    undo_move(move, log) {
        let tmp = this[move.dst].last_count();
        this[move.dst].pour_last_out();
        this[move.dst].pour_in(log.color, tmp-log.count);
        this[move.loc].pour_in(log.color, log.count);
    }
}

function is_valid(state, color_count) {
    let bottle_count = state.length;
    let portion_count = state[0].length;

    let color_occurrences = Array(color_count+1);
    for(let i = 0; i < color_count+1; i++)
        color_occurrences[i] = 0;

    for(let i = 0; i < bottle_count; i++) {
        let empty = false;
        for(let j = 0; j < portion_count; j++) {
            color_occurrences[state[i][j]] += 1;
            if(empty && state[i][j] != 0)
                return false;
            if(state[i][j] == 0)
                empty = true;
        }
    }
    for(let i = 0; i < color_count+1; i++)
        if(color_occurrences[i] % PortionCount != 0)
            return false;
    if(color_occurrences[0] == 0)
        return false;
    return true;
}

function solve(state) {
    if(state.is_sorted())
        return true;

    let moves = state.find_moves();
    for(let i = 0; i < moves.length; i++) {
        let log = state.make_move(moves[i])
        if(solve(state)) {
            Solution.push(moves[i]);
            state.undo_move(moves[i], log);
            return true;
        }
        state.undo_move(moves[i], log);
    }
    return false;
}