import psycopg2
import tkinter as tk
from tkinter import ttk
import re

def key_stroke_next(event):
    update_view()

def key_stroke_remove_tokens(event):
    remove_tokens()

def remove_tokens_event_button():
    remove_tokens()

def focus_next_window(event):
    event.widget.tk_focusNext().focus()
    return("break")

# window
window = tk.Tk()
window.configure(bg="#1A1A1D")
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()
window.geometry(f"{screen_width}x{screen_height}")
window.state('zoomed')
window.bind("<Escape>", key_stroke_next)
window.bind("x", key_stroke_remove_tokens)

# interactive frame
main_frame = ttk.Frame(window)
main_frame.pack(fill=tk.BOTH, expand=1)

# canvas
canvas = tk.Canvas(main_frame, bg='#1A1A1D', highlightthickness=0)  # Remove canvas border
canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=1)

# scrollbar
scrollbar = ttk.Scrollbar(main_frame, orient=tk.VERTICAL, command=canvas.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
canvas.configure(yscrollcommand=scrollbar.set)
canvas.bind('<Configure>', lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

# scrollable frame inside the canvas
scrollable_frame = ttk.Frame(canvas)
scrollable_frame.configure(style="Custom.TFrame")  # Apply custom style
canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")

# Style for ttk widgets
style = ttk.Style()
style.configure("Custom.TFrame", background="#1A1A1D")

# Global variables
rows = []
current_row_header = ''
current_body = ''
current_idx = 0
concat_string_content = ''
current_body_tokens = []
current_offer_label = tk.Label(
    scrollable_frame, text='', font=('Arial', 25), bg='#1A1A1D', fg='#ffffff'
)
button_to_remove_tokens = tk.Button(
    scrollable_frame, text='Remove tokens', font=('Arial', 15), bg='#1A1A1D', fg='#ffffff', command=remove_tokens_event_button
)

current_token_frames = []
current_token_texts = []
frames_to_be_deleted = []

def remove_tokens():
    global frames_to_be_deleted
    global current_body_tokens
    global current_token_texts
    if len(frames_to_be_deleted) == 0:
        return
    for frame in frames_to_be_deleted:
        del_idx = current_token_frames.index(frame)
        current_body_tokens.pop(del_idx)
        current_token_texts.pop(del_idx)
        frame.destroy()
        current_token_frames.pop(del_idx)
    frames_to_be_deleted = []
    flush_view(False)
    create_labels_for_tokens(current_body_tokens)

def flush_view(delete_tokens=True):
    global current_body_tokens
    global current_token_frames
    global current_token_texts

    if delete_tokens:
        current_body_tokens = []

    for frame in current_token_frames:
        frame.destroy()

    current_token_frames = []
    current_token_texts = []

def save_data_to_files():
    global current_body_tokens
    global current_token_texts
    # save id
    with open('resources/traversed-ids.txt', 'a', encoding="utf-8") as infile:
        infile.write(f'{rows[current_idx][0]}\n')

    # save tokens with labels
    with open('resources/X_and_y.txt', 'a', encoding="utf-8") as infile:
        for i in range(0, len(current_body_tokens)):
            infile.write(f'{current_body_tokens[i]};{current_token_texts[i].get("1.0", "end")}')
        infile.write(f'----------{rows[current_idx][0]}\n')

def update_view():
    global current_body
    global current_row_header
    global current_idx
    global current_offer_label
    global current_body_tokens
    # SAVE existing data
    save_data_to_files()

    # delete previous tokens
    flush_view()

    # load new data
    current_idx += 1
    current_id = rows[current_idx][0]
    current_row_header = rows[current_idx][1]
    current_offer_label.configure(text=f'[{current_id}]: {current_row_header}')
    current_body = rows[current_idx][4]
    new_tokens = tokenize_bazos_description(current_body)   
    current_body_tokens = new_tokens
    create_labels_for_tokens(new_tokens)

def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )
    connection.autocommit = True
    return connection


def tokenize_bazos_description(description):
    tokens = re.split(r'[ \t\n\r,;/:°]+', description)
    return tokens

def fetch_rows():
    global rows
    conn = connect_to_postgresql()
    cur = conn.cursor()
    cur.execute('SELECT * FROM bazos_data_scraping')
    rows = cur.fetchall()
    rows.sort()

def add_to_del_frames(frame, is_checked):
    global frames_to_be_deleted
    if is_checked:
        frames_to_be_deleted.append(frame)
    else:
        frames_to_be_deleted.remove(frame)

def create_frame_for_token(token):
    global scrollable_frame
    global current_token_texts
    # Token frame
    token_frame = tk.Frame(scrollable_frame, bg='#1A1A1D')
    token_frame.pack(fill=tk.X, pady=5)  # Fill horizontally to align all pairs

    # Label
    new_label = tk.Label(
        token_frame, text=token, font=('Arial', 10), bg='#1A1A1D', fg='#ffffff'
    )
    new_label.pack(side=tk.LEFT, padx=(20, 10))

    # Delete Checkbox
    # del_checkbox_var = tk.BooleanVar()
    # del_checkbox = tk.Checkbutton(
    #     token_frame,
    #     text="",
    #     variable=del_checkbox_var,
    #     command=lambda t=token_frame, c=del_checkbox_var: add_to_del_frames(t,c),
    #     bg='#1A1A1D',
    #     activebackground='#1A1A1D',
    #     fg='#ffffff',
    #     selectcolor='#1A1A1D',
    # )
    # del_checkbox.place(x=280)

    # Text
    text_box = tk.Text(token_frame, height=1, width=3, bg='#1A1A1D', fg='#ffffff', insertbackground='#ffffff')
    text_box.insert("1.0", '0')
    text_box.bind("<Tab>", focus_next_window)
    text_box.place(x=200)
    current_token_texts.append(text_box)

    current_token_frames.append(token_frame)

def create_labels_for_tokens(tokens):
    for token in tokens:
        create_frame_for_token(token)

def init():
    global current_row_header
    global current_body
    global current_offer_label
    global current_body_tokens
    global current_idx
    fetch_rows()
    try:
        with open('resources/traversed-ids.txt', 'r', encoding="utf-8") as outfile:
            last_line_id = outfile.readlines().pop()
        ids = [row[0] for row in rows]
        idx = ids.index(int(last_line_id)) + 1
        current_row_header = rows[idx][1]
        current_body = rows[idx][4]
        current_offer_label.configure(text=f'[{ids[idx]}]: {current_row_header}')
        current_body_tokens = tokenize_bazos_description(current_body)
        current_idx = idx
    except Exception as e:
        print(e)
        print('Initialization from start...')
        current_row_header = rows[0][1]
        current_body = rows[0][4]
        current_offer_label.configure(text=f'[{rows[0][0]}]: {current_row_header}')
        current_body_tokens = tokenize_bazos_description(current_body)


if __name__ == "__main__":
    init()
    current_offer_label.pack()
    button_to_remove_tokens.pack()
    create_labels_for_tokens(current_body_tokens)
    window.mainloop()
