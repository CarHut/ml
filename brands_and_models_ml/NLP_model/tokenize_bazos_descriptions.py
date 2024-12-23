import psycopg2
import tkinter as tk
from tkinter import ttk

# window
window = tk.Tk()
window.configure(bg="#1A1A1D")
screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()
window.geometry(f"{screen_width}x{screen_height}")
window.state('zoomed')

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
current_body_tokens = []

current_offer_label = tk.Label(
    scrollable_frame, text='', font=('Arial', 25), bg='#1A1A1D', fg='#ffffff'
)
current_body_token_labels = []
current_body_token_checkboxes = []
current_body_token_texts = []


def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )
    connection.autocommit = True
    return connection


def tokenize_bazos_description(description):
    tokens = description.split()
    return tokens


def fetch_rows():
    global rows
    conn = connect_to_postgresql()
    cur = conn.cursor()
    cur.execute('SELECT * FROM bazos_data_scraping')
    rows = cur.fetchall()
    rows.sort()


def create_labels_for_tokens(tokens):
    global scrollable_frame
    global current_body_token_labels
    global current_body_token_checkboxes
    global current_body_token_texts

    for token in tokens:
        # Token frame
        token_frame = tk.Frame(scrollable_frame, bg='#1A1A1D')
        token_frame.pack(fill=tk.X, pady=5)  # Fill horizontally to align all pairs

        # Label
        new_label = tk.Label(
            token_frame, text=token, font=('Arial', 10), bg='#1A1A1D', fg='#ffffff'
        )
        new_label.pack(side=tk.LEFT, padx=(20, 10))

        # Checkbox
        checkbox_var = tk.BooleanVar()
        checkbox = tk.Checkbutton(
            token_frame,
            text="",
            variable=checkbox_var,
            # command=lambda t=token: on_checkbox_click(t),
            bg='#1A1A1D',
            activebackground='#1A1A1D',
            fg='#ffffff',
            selectcolor='#1A1A1D',
        )
        checkbox.place(x=200)  # Fixed x for checkboxes

        # Text
        text_box = tk.Text(token_frame, height=1, width=3, bg='#1A1A1D', fg='#ffffff')
        text_box.place(x=230)

        current_body_token_texts.append(text_box)
        current_body_token_checkboxes.append(checkbox)
        current_body_token_labels.append(new_label)


def init():
    global current_row_header
    global current_body
    global current_offer_label
    global current_body_tokens
    fetch_rows()
    try:
        with open('resources/traversed-ids.txt', 'r') as outfile:
            last_line_id = outfile.readlines().pop()
        ids = [row[0] for row in rows]
        idx = ids.index(int(last_line_id))
        current_row_header = rows[idx][1]
        current_body = rows[idx][4]
        current_offer_label.configure(text=f'[{last_line_id}]: {current_row_header}')
        current_body_tokens = tokenize_bazos_description(current_body)
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
    create_labels_for_tokens(current_body_tokens)
    window.mainloop()
