async function toggle(ele) {
    item = ele.getAttribute("item")
    act = ele.getAttribute("act")
    const request = await fetch('/control/' + item + '/' + act)
    const response = await request.json()

    if (response.code === 200) {
        window.location.reload()
    }
}


async function waterLength() {
    new_length = document.getElementById("water_length").value

    const request = await fetch('/config/water/length', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({length: Number(new_length)})
    })
    if (request.status === 200) {
        window.location.reload()
    }
}

