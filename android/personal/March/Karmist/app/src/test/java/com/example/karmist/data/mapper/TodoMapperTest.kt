package com.example.karmist.data.mapper
import com.example.karmist.data.model.KarmSource
import com.example.karmist.data.remote.TodoDto
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
class TodoMapperTest {
    @Test
    fun `remote todo maps to remote karm with negative id`() {
        val dto = TodoDto(
            userId = 1,
            id = 7L,
            title = "  Buy milk  ",
            completed = true
        )
        val karm = dto.toKarm(now = 1234L)
        assertEquals(-7L, karm?.id)
        assertEquals("Buy milk", karm?.description)
        assertEquals(true, karm?.completed)
        assertEquals(1234L, karm?.date)
        assertEquals(KarmSource.REMOTE, karm?.source)
    }
    @Test
    fun `invalid remote id returns null`() {
        val dto = TodoDto(
            userId = 1,
            id = 0L,
            title = "Ignore me",
            completed = false
        )
        assertNull(dto.toKarm())
    }
}
